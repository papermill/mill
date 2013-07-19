var glob = require("glob");

// function for running  auto-configuration
function autoconf(config, callback) {

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
    
    function globResults(err, files) {
      
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

module.exports = autoconf;