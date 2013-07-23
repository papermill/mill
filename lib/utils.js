var fs = require('graceful-fs'),
    async = require('async'),
    glob = require('glob'),
    tool = {};

// function to search the filesystem (using `glob` module)
tool.searchFs = function (string, directory, callback) {
  
  glob(string, 
  
    // 
    // - Options as per the [`glob` manual](https://npmjs.org/package/glob)
    // 
    {
      //    > "The current working directory in which to search.
      'cwd': directory,
      //    > no dotfiles
      'dot': false,
      //    > Add a / character to directory matches.
      'mark': true,
      //    > Perform a case-insensitive match. (…)"
      'nocase': true,
      'nonegate': true
    }, 
    
    function globResult(err, res) {
      callback(err || null, res || null);
  });
  
};

// function to check if a `path` is **not** a directory
tool.isNotDir = function (path, callback) {
  fs.stat(path, function (err, stats) {
    if (err) {
      callback(err)
    }
    callback(!stats.isDirectory());        
  });
};

// function to safely read JSON file from `path` in file system
tool.readJSONfile = function (path, callback) {
  
  fs.readFile(path, 'utf8', function (err, data) {
    
    // catch file read error and `callback` with it
    if (err) { return callback(err); }
 
    // carefully parse the JSON data
    try {
      result = JSON.parse(data);
    } catch (err) {
      // catch any parsing error and callback with it
      return callback(err);
    }

    // callback with no error and the result
    callback(null, result);

  });
  
}

// function to clean directories from a `list` of paths
tool.cleanDirectories = function (list, callback) {
  // run `isNotDir` for every item in `list`, then `callback` with `result`.
  async.filter( list, tool.isNotDir, callback );
};

// 
// # Attaching
// 

// - `exports.attach` gets called by broadway on `app.use`
tool.attach = function (options) {
  
  var app = this;
  
  // Here, we attach some functions directly to the `app` object.
  
  // `fail()` an `app` with log 'message' and 'callback': 
  app.fail = function (message, callback) {
    
    var error = new Error(message);
    
    app.log.error(error);    
    return callback(error);
    
  };

};

// `exports.init` gets called by broadway on `app.init`, 
tool.init = function (done) {
  // but this plugin doesn't require any initialization steps)
  return done();
};

// export `tool` as module
module.exports = tool;