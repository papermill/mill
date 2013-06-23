// A function to build output from pm-config

var fs = require('graceful-fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    f = require('underscore'),
    pandoc = require('jandoc-async');

function build(baseConfig, callback, app) { // `app` is optional
  
  var pandocConfig = {},
      millConfig,
      c = millConfig;
      
  // Handle configuration format: 
  // 
  //     millConfig = {
  //       'files': ['lorem-ipsum.markdown'],
  //       'output_dir': 'foo',
  //       'pandoc': {…}
  //     }
  
  // Just copy *baseConfig* for now, 
  // the *files* array is handled inside an async `forEach(file)`.
  millConfig = baseConfig;

  // f.extend(
  //   // target
  //   pandocConfig,
  //   // base config from app, without internal values
  //   f.omit(millConfig, 'output_format'),
  //   // build file paths from conf
  //   { 
  //     'input': file.path,
  //     'output': path.join(c.cwd, c.output_dir, file.basename),
  //     'write': c.format,
  //     'files': null
  //   }
  // );
  
  
  // create the output dir
  mkdirp(millConfig.output_dir, function () {
    
    // TODO: copy assets…
  
    // build each configured file in 'files' array
    async.each(millConfig.files, function (inputfile) {
        
      // handle file path settings etc.
      var file;
            
      file = {
        path: path.join(millConfig.cwd, inputfile), 
        ext: path.extname(inputfile),
        basename: path.basename(inputfile)
      };
    
      // Combine per-file configuration in order:
      // 
      var pandocConfig = {};
      f.extend(
        // - target
        pandocConfig,
        // - base config for this run
        millConfig.pandoc,
        // - built file paths from conf
        { 
          'input': file.path,
          'output': path.join(millConfig.cwd, millConfig.output_dir, millConfig.format),
          'files': null
        }
      );
    
      // run pandoc with config
      if (app) app.log.debug(config);
    
      pandoc(pandocConfig, function (err, res) {
        callback(err || res);
      });

    }, function (err) {
    
      // callback after `async.each()`
      callback(err || null);
    
    });
  
  });
  
};

// export as module
module.exports = build;