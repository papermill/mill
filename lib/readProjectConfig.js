// *A module to read a papermill project's configuration*

//  # Setup
// 
var fs = require('fs-extra'),
    path = require('path'),
    f = require('underscore'),
    mill = require('../mill-cli'),
    tool = require('./utils');

//  # Module
// 
module.exports = function readConfig(directory, millconf, callback) {
  
  var dir = directory || process.cwd;
  millconf = millconf;
  
  // 1. Get the config files with a function which 
  //   gives back an array of exisiting config files.
  getConfigFiles(millconf, dir, 
    
    function (err, configs) {
    
    if (err) { return callback(err); }
    
    // 2. Read the first found config and `callback` with it.
    readConfigs(configs, directory, callback);

  });

}

// # Worker functions
// 

// ## getConfigFiles
// 

// A function to search for configuration files: 
function getConfigFiles(millconf, directory, callback) {
  
  // Search for all (configured) configuration file names. 
  tool.searchFs("{" + millconf.CONFIGFILES + "}", directory, 
    
    function searchResults(err, files) {
            
      // If there was an error, or we got back an *empty array*, 
      // we callback with an error.
      if (err || !files.length) {        
        var msg = err || "No config file found!";
        return callback(new Error(msg), null);
      }
      
      // Otherwise, we convert all the list entries to full paths 
      files.forEach(function (file, i) {
        files[i] = path.join(directory, file);
      });
      
      // and callback with the list of existing config files.
      return callback(null, files);
      
    }
    
  );
  
}

// ## readConfigs

// 
// Function to read config file(s).
// 
function readConfigs(list, directory, callback) {
    
  // - prepare result objects
  var JSONfile,
      result;
  
  // - clean the list: remove directories
  tool.cleanDirectories( list, 
    
    function (result) {
      
      // return error if the list is empty after cleaning
      if (!result.length) {
        return callback("No config file found!");
      }
      else {
      
        // - pick the first config file from the remaining list
        JSONfile = f.first(result);
        mill.dbug("config file:", JSONfile);
      
        // - safely read and parse the JSON file
        fs.readJson(JSONfile, function (err, data) {
          
          // - check for error or missing data
          if (err || !data) {
            err = err || new Error('Could not read config!');
            callback(err);
          }
          
          // - add the path and `callback`
          data.path = directory;
          
          mill.dbug("data", data);
          callback(null, data);
          
        });
        
      }

    }
  );
}
