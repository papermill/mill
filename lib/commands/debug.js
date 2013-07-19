/*jslint node: true, regexp: true, nomen: true, sloppy: true, vars: true, white: true */

function debug(args, callback) {
  var app = this;
  
  console.log("Arguments: ", args);
  console.log("Conf: ", app.config.get());
  
  // done
  callback();
  
}

// The whole command workflow lies in 1 main function,
// which we also export as a module;
debug.usage = "Just output debug information!"
module.exports = debug;
