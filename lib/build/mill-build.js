// *A module to build output from papermill project config*

// 
// # Setup
// 
var fs = require('fs-extra'), // uses 'graceful-fs' if available
    path = require('path'),
    temp = require('temp'),
    async = require('async'),
    f = require('underscore'),
    pandoc = require('pandoc-api');
    mill = require('../../mill-cli');

// 
// # Module
// 
module.exports = function build(project, callback) {
    
  // Here lies just the workflow connecting the worker functions. 
  // Each functions `callback` values is the first argument of the next function.
  
  async.waterfall(
    
    [
      function start(callback) {
        inflateConfig(project, callback)
      },
      deriveBuildJobs,
      render
    ],
    
    callback
    
  );
  
};

// 
// # Worker functions
// 
// ## inflateConfig
// 
function inflateConfig(config, callback) {
  
  // - apply defaults where nothing is given
  // - read all lazy-configurable properties (input, output)
  // - see if it is string, array or object
  // - rewrite lazy values to full values
  
  // Handle errors - TODO: spec validation…
  if (!config) {
    callback(new Error("No config given, can't inflate!"));
  }
  
  // - `project` config just with "known" properties
  var project = f.pick(config, mill.config.get('papermill:known_props'));
  
  // ### `input` -- NOT optional for now
  
  ['input'].forEach(function (prop) {
    
    if (typeof config[prop] === 'undefined') {
      callback(new Error("No config.input!"));
    }
    
    var item = config[prop];
    
    // - is it a string?
    if (typeof item === 'string') {
      // use it as `path`
      config[prop] = [{ 'path': item }];
      // return null;
    }
    // - is object (or array)?
    if (typeof item === 'object') {

      // - is really array?
      if (Array.isArray(item)) {
        // nothing to do, TODO: recursion
        // return null;
      }
      // - is really an object?
      else {
        
        // - is there a non-empty list in it?
        //   (Configure list property name to 'list')
        var lst = 'list';
        if (item[lst] && item[lst].length) {
        
          // - prepare result
          var res = [],
          // - save the base config, minus the `list`
          base = f.extend({}, f.omit(item, lst));
          
         // - loop over the list TODO: recursion
          item.list.forEach(function (li) {
            
            // - assume it is an object
            var i = li;
            
            // - if there is a string inside, read as `path` to new obj
            if (typeof li === 'string') {
              i = { 'path': li };
            }
            
            // extend with `base` (without `.path`)
            i = f.extend({}, f.omit(base, 'path'), i);
            
            // - set path by joining those from `base` and `i`, if they exist
            i.path = path.join(base.path || '', i.path || '');
            
            res.push(i);
            
          });
          
          // - link the result
          config[prop] = res;
          
        }
        else {
          // - just put it into array
          config[prop] = [item];
        }
        
      }
    }
    
    // - extend every input in list with project config
    config[prop].forEach(function (obj, i) {
     config[prop][i] = f.extend({}, project, obj);
    });

  });

  // ### `output` (optional)
  
  ['output'].forEach(function (prop) {
    
    var defaultTargets = mill.config.get('papermill:targets');
  
    // - is there anything?
    if (config[prop] === undefined) {
      
      // if not, load default config (string)!
      config[prop] = mill.config.get('papermill:output_dir');
      
    }

    var item = config[prop];
  
    // - is it a string?
    if (typeof item === 'string') {
      
      // - use it as `project.output_dir`!
      config.output_dir = item;
      
      // - item has no sub-folder
      item = { 'path': '' };

      // - apply default targets
      defaultTargets.forEach(function (target) {
        item[target] = true;
      });
      
    }
  
    // - is object/array?
    if (typeof item === 'object') {

      // - is array?
      if (Array.isArray(item)) {
        // nothing to do!
      }
    
      // - is object?
      else {
      
        // - make a new `list`
        var list = [];
        
        // try to read `path` to `output_dir`
        if (item.path && typeof item.path === 'string') {
          config.output_dir = item.path;
        }
      
        // - read `base` config, minus `defaultTargets` and `path`
        //   (for usage further down the tree)
      
        var base = f.extend({}, f.omit(item, 'path', defaultTargets));
        
        // - loop *each* default target
        defaultTargets.forEach(function (target) {
                  
          // - make empty `res`ult
          var res = {};
        
           // - is there something?
          if (item[target] !== undefined) {
            
            // - is it a boolean (true/false)?
            if (typeof item[target] === 'boolean') {
            
              // - is it `true`?
              if (item[target] === true) {
              
                // - use it, extended with the `base` settings
                res = f.extend({}, base, { 'target': target });
              }
              else {
                // - it is `false`, abort!
                return null;
              }
            
            }
          
            // - is it an object (and not an array)?
            if (typeof item[target] === 'object' && !Array.isArray(item[target])) {

              // - try reading `output_dir`
              if (item.path) {
                config.output_dir = item.path;
              }
              
            }
            
          }
          
          // - extend `res` with `base` and `target`
          res = f.extend({}, base, item[target], { 'target': target });
          
          // - add `obj` to `list` (if target was disabled we have already aborted)
          list.push(res);
        
        });
        
        // if there is no `output_dir` found in config, apply default
        if (!config.output_dir) {
          config.output_dir = mill.config.get('papermill:output_dir');
        }

        // - add new `list` to `config`
        config[prop] = list;
        
      }
    }
  });
  
  // - `callback` with the inflated config
  callback(null, config)

}

// ## deriveBuildJobs

function deriveBuildJobs(config, callback) {

  // - multiply inputs with outputs
  // - TODO: ??? read metadata from input.output?
  
  if (mill.DEBUG) { require('eyes').inspect(config); }

  // - make empty result
  config.jobs = [];
  
  // - *For each* item in `input`
  config.input.forEach(function (item) {

    // - *For each* target in `output`
    config.output.forEach(function (target) {
      
     // - make job by combinig config in order
      var job = f.extend(
        {},
        f.omit(target, 'path'),
        f.omit(item, 'path')
      );
      
      // - handle `paths`
      job.input = item.path;
      job.output = target.path || ''; // can be empty if no sub-dir
      
      // - load default pandoc config
      job = f.extend(
        {},
        mill.config.get('papermill:pandoc'),
        job
      );
      
      // - load default config for targets 'print' and 'web'
      mill.config.get('papermill:targets').forEach(function (target) {
        
        if (job.target === target) {
          job = f.extend(
            {},
            mill.config.get('papermill:pandoc_targets:' + target),
            job
          );
        
        }
      
      });
      
      // - internal option mapping (list of `['old','new']` items)
      mill.config.get('papermill:internal_config_mapping')
        .forEach(function (opt) {
          // If there is value for 'old'
          if (job[opt[0]]) {
            // set 'new' = 'old'
            job[opt[1]] = job[opt[0]];
            // delete 'old'
            delete job[opt[0]];
          }
        });
        
      // ## handle remaining unknown options
      
      // We need to safe already configured `variable` string or object.
      var vario = {};
      if (typeof job.variable === 'string') {
        vario[job.variable] = true;
      }      
      else if (typeof job.variable === 'object') {
        vario = f.extend({}, vario, job.variable);
      }      
      job.variable = vario;
      
      // `unknownOptions` is an array of all the `job` keys,
      //   minus the options known by `pandoc`.
      var unknownOptions = f.difference(f.keys(job), pandoc.OPTIONS);
      
      // Now loop over `unknownOptions` and rewrite them to pandoc-variables 
      unknownOptions.forEach(function (v) {
        // (if there is something at all).
        if (job[v] !== 'undefined') {
          job.variable[v] = job[v] || true;
          delete job[v];          
        }
      });
      
      // process.exit()
      
      // Finally, we add the `job` to the list
      config.jobs.push(job);

    });
    
  });
    
  // callback with result
  callback(null, config);

}

// ## Render
// 
function render(build, callback) {
  
  // require('eyes').inspect(build);
  
  // - make a tmp working directory
  temp.mkdir('mill', function(err, workingdir) {

    if (err) { return callback(err); }

    // Debug: don't use the temp dir
    if (mill.config.get('DEBUG:on')) {
      workingdir = mill.config.get('DEBUG:workingdir') || workingdir;
      fs.mkdirsSync(workingdir);
    }
    
    if (mill.DEBUG) { mill.log.debug("Working directory:", workingdir); }
    
    // - build *each* job
    async.each(
      build.jobs,

      function(job, callback) {

        if (mill.DEBUG) { require('eyes').inspect(job); }
      
        // - copy assets…
        var assets = ["template", "css"];
        async.each(
          assets,
          function(asset, callback) {
            // 'css' can be an Array, loop it
            if (typeof asset === 'css' && Array.isArray(job[asset])) {
              async.each(job[asset], function(item, callback) {
                return copyAsset(item, workingdir, callback);
              });
            } else {
              return copyAsset(job[asset], workingdir, callback);
            }
          },
          function end(err) {

            if (err) { return callback(err); }

            // - handle paths (make 'em full!)
            var filename = path.basename(job.input)
              .replace(path.extname(job.input), ''); // "/path/foo.bar" > "foo"

            job.input = path.join(build.path, job.input);
            job.output = path.join(workingdir, build.output_dir, job.output, filename);
            if (job.bibliography) {
              job.bibliography = path.join(build.path, job.bibliography);
            }
            if (job.variable.target === 'print') {
              job.output = job.output + '.pdf';
            }
            if (job.variable.target === 'web') {
              job.output = job.output + '.html';
            }

            handleInputFiles(job, workingdir, function(err, res) {
              if (err) { return callback(err); }

              handleOutputFiles(job, function(err, res) {
                if (err) { return callback(err); }

                // - finally, build it!
                if (mill.DEBUG) { mill.log.debug('build.job:', job); }
                pandoc(job, callback);

              });

            });

          }
        );

      }, function finishedBuilds(err) {

        if (err) { return callback(err); }

        var resultpath = path.join(workingdir, build.output_dir),
          outputpath = path.join(build.path, build.output_dir);

        fs.copy(
        resultpath,
        outputpath,
        callback);

      }
    );

  });

}

// # Helper functions
// 
// ## makeWorkingDir TODO: seperate
// function makeWorkingDir(build, callback) {
// }

// ## makeFullPaths TODO: seperate
// function makeFullPaths(build, job, callback) {
// }

// ## copyAssets TODO: seperate
// function copyAssets(build, job, callback) {
// }

// ## handle input files/directories
// 
// `jandocs` interprets directories as a list of files, but we want to combine them!
function handleInputFiles(job, workingdir, callback) {
  
  // console.log(job);
  
  // - basic checking: does anything exist?

  fs.exists(job.input, function (exists) {
  
    if (!exists) {
      return callback("Input does not exists!" + job.input);
    }
  
    // ok, but is it a directory?
    fs.stat(job.input, function (err, stats) {
      if (err) { return callback(err); }
      
      if (!stats.isDirectory()) {
        // It is NOT a directory, nothing to do!
        return callback(null, job);
      }
      else {
        // 
        // It IS a directory, we need to combine the files in order:
        // 
        // - prepare the `combinedInput` and -`File`
        var combinedInput = '',
            combinedInputFile = path.join(workingdir, path.basename(job.input) + '.md');

        // - get list of files
        fs.readdir(job.input, function (err, files) {
          
          if (err) { return callback(err); }
          
          // - read and combine all the files
          async.each(
            files,
            function loop(file, callback) {
              fs.readFile(
                path.join(job.input, file),
                { encoding:'utf8' },
                function (err, data) {
                  if (err) { return callback(err); }
                  
                  // add file content to `combinedInput`, with extra empty line
                  combinedInput = combinedInput + data + '\n';
                  callback(null);
                  
                }
              );
            },
            function end(err) {
              
              // save the `combinedInput` to file
              fs.writeFile(combinedInputFile, combinedInput, function (err) {
                
                if (err) { return callback(err); }
                
                // set new input and return job
                job.input = combinedInputFile;
                callback(err || null, job);
                
              });
              
            }
          );
        
        });
      
      
      }
      
    });
  
  });
  
}

// ## handle output files/directories
// 
// We just need to make shure that all paths where want to write 
//  exist in the working directory.
function handleOutputFiles(job, callback) {
  fs.createFile(job.output, callback);
}

// ## copyAsset
// 
function copyAsset(asset, workingdir, callback) {
  if (typeof asset === 'string') {
    fs.copy(asset, path.join(workingdir, path.basename(asset)), callback);
  }
  else {
    // nothing to do
    callback(null);
  }
}


