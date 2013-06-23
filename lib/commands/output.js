/*jslint node: true, regexp: true, nomen: true, sloppy: true, vars: true, white: true */

// # mill **output**
//
// > Create and set up a new project.
// 
// ---

// (Required modules)
var fs = require('graceful-fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    f = require('underscore'),
    pandoc = require('jandoc'),
    build = require('../mill-build'),
    autoconf, // TODO: module
    getConfig; // TODO: module



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
function output (argument, callback) {
  
  // Our context is set to the application, we save it in a variable for convenience.
  var app = this;
  
  app.log.debug("Arg:", argument);
  
  
  // An async chain of events, where [each functions callback value becomes the next functions first argument](https://github.com/caolan/async#waterfalltasks-callback):
  async.waterfall([
    
    // 1. Get the user configuration
    //    - yes: build
    //    - no: auto-mode
    function getUserConf(callback) {
      
      //   - Try to read config file from working directory
      getConfig(process.cwd, function (err, config) {
        
        // fail on error
        if (err) { return callback(err); }
        
        // callback with received config if there is such
        if (config) {
          
          return callback(null, config);     
              
        }
        // if that fails, use `autoconf()`
        else if (!config){
      
          app.log.debug("No config found, starting autoconf()");
          autoconf(app.config.get(), function (err, conf) {
            
            return callback(err || null, conf);
            
          });
            
        }

      });  
      
    },
    
    // 2. Make complete build configuration
    function makeMillConfig(userConfig, callback) {
  
      app.log.debug("userConfig", userConfig);
      
      var millConfig = {};
    
      // - combine configuration in order
      f.extend(
        // target
        millConfig,
        // base config from app
        app.config.get('papermill'),
        // user supplied config
        userConfig
      );
  
        callback(null, millConfig);
  
    },
  
    // 3. Build with the configuration
    function buildWithBuildConf(config, callback) {

      app.log.debug("build config", config);

      // build with internal module  
      build(config, function (err, res) {
        
        callback(err || null, res);
        
      });
    
    }],
    
    // 4. Done
    function finishedChain(err, result) {
      
      if (err) { return app.fail(err, callback); }
      
      // build answer
      var res = result;
      
      // callback to the CLI
      app.log.debug("build res", res);
      callback(null, res);
    
  });
  
}

// TODO: function to get the user's build config
function getConfig(path, callback) {

  callback(null, null);

}

// function for running  auto-configuration
function autoconf(config, callback) {

  var glob = require("glob");

  // - get a list of all Markdown files by extension (configured)
  glob("**/*.{" + config.MD_EXTENSIONS + "}", 
  
    // 
    // - Options as per the [`glob` manual](https://npmjs.org/package/glob)
    // 
    {
      //    > "The current working directory in which to search.
      'cwd': config.cwd,
      //    > no dotfiles
      'dot': false,
      //    > Add a / character to directory matches.
      'mark': true,
      //    > Perform a case-insensitive match. (…)"
      'nocase': true,
      'nonegate': true
    }, 
    
    function (err, files) {
      
      // filter excluded dirs (like 'node_modules')
      
      config.AUTO_EXCLUDED_DIRS.forEach(function (dir) {
      
          files = files.filter(function(item){
          
              if (item.indexOf(dir) !== 0) {
              
                return item;    
                    
              }
                    
          });
      
      });
      
      // build result      
      if (files) {
        
        // callback with result
        callback(null, { 'files': files });
           
      } else {
        
        err = err || new Error("wtf");
        
        // callback with error
        callback(err || null);
        
      }
      
    });
      
}

// The whole command workflow lies in 1 main function,
// which we also export as a module;
output.usage = usage;
module.exports = output;
