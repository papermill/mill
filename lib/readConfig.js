// Module to read a papermill project's configuration

var f = require('underscore'),
    tool = require('./utils');

// This is the workflow, thus gets `export`ed.
module.exports = function readConfig(directory, millconf, callback) {
  
  var dir = directory || process.cwd;
  millconf = millconf;
  
  // 1. Get the config files with a function which 
  //   gives back an array of exisiting config files.
  getConfigFiles(millconf, dir, 
    
    function (err, configs) {
    
    if (err) { return callback(err); }
    
    // 2. Read the first found config and `callback`.
    readConfigs(configs, directory, callback);

  });

}

// Function to search for configuration files: 
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
      
      // Otherwise, we callback with the result (list of existing config files)
      return callback(null, files);
      
    }
    
  );
  
}

// 
// Function to read configs:
// 
function readConfigs(list, directory, callback) {
    
  // - prepare result objects
  var JSONfile,
      result;
  
  // - clean the list: remove directories
  tool.cleanDirectories( list, 
    
    function (result) {
      
      // - pick the first config file from the remaining list
      JSONfile = f.first(result),
      console.log("config file: " + JSONfile);
      
      // - safely read and parse the JSON file
      tool.readJSONfile(JSONfile, callback);

    }
  );
} 
