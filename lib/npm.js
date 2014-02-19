// module to use some features provided by npm,
// without needing to install it globally.

var npm = require("npm");

// forced config (user config still applies)
var npmconf = {
  "loglevel": "silent"
};

// start `npm`
npm.load(npmconf, function (err) {
  if (err) return handlError(err)
  
  // run `npm install`
  npm.commands.install([
    // FIXME: fake argument for testing
    "git+https://github.com/papermill/bookstrap.git#master"],

    function (err, data) {
      if (err) return commandFailed(err);
      // command succeeded, and data might have some info
      console.log(data);
    });
  
  // this seems to have no effect, but could maybe used
  // to log to a file for debugging…
  npm.on("log", function (message) {
    // console.log(message);
  });
});