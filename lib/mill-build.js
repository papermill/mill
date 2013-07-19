// A module to build output from pm-config

var fs = require('fs-extra'), // uses 'graceful-fs' if available
    path = require('path'),
    async = require('async'),
    f = require('underscore'),
    temp = require('temp'),
    pandoc = require('jandoc-async');

// tmp
var titleblock = ['author', 'title', 'date'];
var metadata = titleblock.concat(['bibliography', 'short_title']);
var outputs = ['print', 'web'];

function makeBuildConfig(project, lepath, callback) {
  
  var build = {
    path: lepath,
    documents: [],
    outputs: [],
    jobs: []
  };
               
  // tmp: project default values
  var pDefault = {
    "author": null,
    "title": null,
    "short_title": null,
    "bibliography": null,
    "date": new Date().toDateString(),
    "input": {
      "format": "markdown"
    },
    "output": {
      "path": "_output",
      "web": true,
      "print": {
        "class": "report"
      }
    }
  }
  
  // tmp: build default values
  var bDefault = {
    outputs: ['print', 'web'],
  }
  
  // project config: 
  // 
  // {
  //   "author": "Max F. Albrecht",
  //   "title": "Papermill. Books in a Browser",
  //   "bibliography": "bibliography.bib",
  //   "input" "BA.md",
  //   "input": {
  //     "path": "BA.md",
  //     "format": "markdown"
  //   },
  //   "output": {
  //     "path": "_output",
  //     "print": {
  //       "class": "book"
  //     }
  //   },
  // }
  // 
  
  // ## Handle metadata properties
  metadata.forEach(function (prop) {
    build[prop] = project[prop] || pDefault[prop];
  });
  
  // ## Handle 'output'
  //   
  // Is it a single string? 
  if (typeof project.output === 'string') {
    build.output_dir = project.output;
  } 
  
  // Is it an object?
  if (typeof project.output === "object") {
    
    // try to read the 'path'
    build.output_dir = project.output.path;
    
    // check for configured outputs (print, web)
    outputs.forEach(function (target) {
      
      if (project.output[target]) {
        
        var output = {};
        
        // only copy if it is an object (could be boolean)
        if (typeof project.output[target] === "object") {
          output = project.output[target];    
        }
        
        output.target = target;
        output.output_dir = project.output[target].path || build.output_dir;
        
        // add output to list
        build.outputs.push(output);
        
      }
      
    });
    
  }
  
  
  // ### Check for missing values, use defaults
  
  if (!build.output_dir) {
    build.output_dir = pDefault.output.path;
  }
  if (!build.outputs.length) {
    build.outputs = bDefault.outputs;
  }
  
  
  // ## Parse 'inputs' to 'documents'
  //
  // Is it a single string? 
  if (typeof project.input === 'string') {
    
    // - read the properties
    var doc = {
      "input": project.input,
      "format": project.input.format || pDefault.input.format
    };
    
    // - add to list
    build.documents.push(doc)
  } 
  
  // Is it an object?
  if (typeof project.input === "object") {
    
    // - read the properties
    var doc = {
      "input": project.input.path,
      "format": project.input.format || pDefault.input.format
    };
    
    // add to document array
    build.documents.push(doc);   
    
  }
  
  // Is it an array? (aka multi-document!)
  if (Array.isArray(project.input)) {
    
    // TODO: combine with previous to 1 function
    
    // - then loop over it
    project.input.forEach(function (input) {
      
      // - read the properties
      var doc = {
        "input": project.input.path,
        "format": project.input.format|| pDefault.input.format
      };
    
      // add to document array
      build.documents.push(doc);   
    
    });
    
  }
  
  
  // ## Build jobs: Documents * Outputs
  // 
  build.documents.forEach(function (doc) {
    
    // - add a job for each output
    build.outputs.forEach(function (output) {
      
      var job = f.clone(doc);
      
      // - use doc metadata, fallback to global
      metadata.forEach(function (prop) {
        
        // FIXME: don't override titleblock if it is contained in doc
        // seems to require hacking pandoc :/
        // (reason: pandoc does not have this option, and we can
        // only find out manually…)
        
        if (titleblock.indexOf(prop) === -1) {
          job[prop] = doc[prop] || output[prop] || build[prop];          
        }
        
      });
      
      // job.output_dir = output.output_dir || build.output_dir;
      job.target = output.target;
      
      // add job to list
      build.jobs.push(job);
  
    });
    
  });
  
  // require('eyes').inspect(build);
  
  render(build, callback);
  
};

function render(build, callback) {
  
  // require('eyes').inspect(build);

  var result = {
    path: build.path
  };
  
  // - create the output dir
  fs.mkdirs(build.output_dir, function () {
    
    // - make a tmp working directory
    temp.mkdir('mill', function(err, workingdir) {
      
      console.log(workingdir);
      
      if (err) { return callback(err); }
      
      // - TODO: copy assets…
  
      // - build *each* job
      async.each(build.jobs, function (job, callback) {
        
        require('eyes').inspect(job);
        
        // - load default pandoc config
        var pandocConfig = {
          "standalone": true,
          "selfContained": true,
          "smart": true,
          "toc": true,
        };
        
        // - fill in job config
        var filename;
        filename = path.basename(job.input)
          .replace(path.extname(job.input), '');
          
        f.extend(
          pandocConfig,
          {
            'input':  job.input,          // input dir
            'output': workingdir,    // output dir/file
            'read': job.format,
            'bibliography': job.bibliography
          }
        );
        
        // - conditional presets for 'web'
        if (job.target === 'web') {
          f.extend(
            pandocConfig,
            {
              "output": path.join(workingdir, filename + ".html"),
              "write": "html5",
              // "template": "",
              // "css": "",
              "variables": {
                "webfont": true,
                "scripts": true
              }
            }
          );
        }

        // - conditional presets for 'print'
        if (job.target === 'print') {
          f.extend(
            pandocConfig,
            {
              "output": path.join(workingdir, filename + ".pdf"),
              "latex-engine": "xelatex"
            }
          );
          
        }
        
        require('eyes').inspect(pandocConfig);

          pandoc(
            pandocConfig, 
            function (err, res) {
              // TODO: return `result`
              callback(err || null, res || null);
            }
          );
        
      }, function finishedBuilds(err) {
        
        var outputpath = path.join(build.path, build.output_dir);
        
        // console.log(workingdir, outputpath);
        
        fs.copy(
          workingdir, 
          '/Users/work/Dropbox/Papermill/Bachelor/_output', 
          function (err, res) {
          
            console.log(err || null, res);
            callback(err || null, res);
          
        });
        
      });
    
    });
      
  });
  
}

// export as module
module.exports = makeBuildConfig;