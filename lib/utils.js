// - `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  // `fail()` `app` with 'message' and 'callback': 
  app.fail = function (message, callback) {
    app.log.error("FAIL!", message);
    return callback(new Error(message));
  };

};

// - `exports.init` gets called by broadway on `app.init`
exports.init = function (done) {

  //     * (this plugin doesn't require any initialization steps)
  return done();

};