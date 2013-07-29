// *A module containing several utilities*

//  # Setup
// 
var fs = require('graceful-fs'),
    async = require('async'),
    glob = require('glob'),
    tool = {};

// # Utilities
// 
// ## searchFs
// 
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

// ## isNotDir
// 
// function to check if a `path` is **not** a directory
tool.isNotDir = function (path, callback) {
  fs.stat(path, function (err, stats) {
    if (err) {
      callback(err)
    }
    callback(!stats.isDirectory());        
  });
};

tool.isDir = function (path, callback) {
  dirCheck(path, true, callback)
};

tool.isNotDir = function (path, callback) {
  dirCheck(path, false, callback)
};

// ## dirCheck
// 
function dirCheck(path, bool, callback) {
  fs.stat(path, function (err, stats) {
    if (err) { callback(err); }
    
    res = !!stats.isDirectory();
    if (!bool) { res = !res; }
    
    callback(null, res);        
  });
};

// # readJSONfile
// 
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

// # cleanDirectories
// 
// function to clean directories from a `list` of paths
tool.cleanDirectories = function (list, callback) {
  // run `isNotDir` for every item in `list`, then `callback` with `result`.
  async.filter( 
    list,
    function (item, callback) {
      tool.isNotDir(item, function (err, res) {
        callback(res);
      })
    },
    callback );
};

// 
// # Attaching
// 

// - `exports.attach` gets called by broadway on `app.use`
tool.attach = function (options) {
  
  var app = this;
  
  // Here, we attach some functions directly to the `app` object.
  
  // `fail()` an `app` with `err`, can be 'string' or 'Error': 
  app.fail = function (error, data, cb) {
    
    var meta, callback;
    
    // no data? use as callback.
    if (typeof data === 'function') {
      callback = data;
    } else {
      meta = data;
    }  
    
    
    if (error.constructor.name !== 'Error') {
      
      if (typeof error === 'string') {
        error = new Error(error);
      }
      else {
        meta = error;
        error = new Error("");
      }
    }
    
    // no meta? use as callback.
    if (typeof meta === 'function') {
      callback = meta;
      app.log.error(error);    
    } else {
      app.log.error(error, meta);
    }  
    return callback(error);
    
  };

  app.dbug = function (string, data) {
    
    if (app.DEBUG) {
      app.log.debug(string);
      require('eyes').inspect(data || null);
    }
    
  };

};

// `exports.init` gets called by broadway on `app.init`, 
tool.init = function (done) {
  // but this plugin doesn't require any initialization steps)
  return done();
};

// export `tool` as module
module.exports = tool;