/*jslint node: true, regexp: true, nomen: true, sloppy: true, vars: true, white: true */

// # mill **output**
//
// > Create and set up a new project.
// 
// ---

// (Required modules)
var fs = require('graceful-fs'),
    path = require('path'),
    async = require('async'),
    f = require('underscore'),
    build = require('../mill-build'),
    readProjectConfig = require('../readProjectConfig');


// ## Usage Information
// 
// This is displayed when the user requests help on this command.
var usage= [
  'Renders a papermill project according to settings.',
  '- Can export to PDF (print) and HTML (web)',
  '- Uses auto-mode when no settings are found',
  '',
  'Usage: mill output <project> [--format]',
  '',
  'Example usages:',
  'mill print',
  'mill output --print </path/to/project>',
  'mill web',
  'mill output --web .' 
];


// ## Workflow: **output**

// this function gets called by the cli app when the user runs the **output** command.
function output (dir, callback) {
  
  // Our context is set to the application, we save it in a variable for convenience.
  var app = this;
  
  // set path from supplied argument or use the current working directory
  dir = path.resolve(dir) || process.cwd();
  
  app.log.debug("dir: ", dir);
  
  // For control flow, we use an `async` chain of events, where ["each functions callback value becomes the next functions first argument"](https://github.com/caolan/async#waterfall):
  // 
  async.waterfall([
    
      // 1. Get the user configuration
      function getUserConf(callback) {
      
        //   - try to read config file from project path
        readProjectConfig(dir, app.config.get(), function (err, config) {
        
          // - abort on error, 
          // callback with received config if there is such
          return callback(err || null, config || null);     

        });  
      
      },
    
      // 2. Build with the configuration
      function (config, callback) {
        build(config, callback);
      }
    ],
    
    // 4. Done
    function finishedChain(err, result) {
      
      if (err) { return app.fail(err, callback); }
      
      //    - build answer
      var res = result;
      
      //    - callback to the CLI
      app.log.debug("build res: ", res);
      callback(null, res);
    
  });
  
}

// The whole command workflow lies in 1 main function,
// which we also export as a module;
output.usage = usage;
module.exports = output;
