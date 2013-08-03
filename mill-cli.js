//                     _   _  
//                 o  | | | | 
//       _  _  _      | | | | 
//      / |/ |/ |  |  |/  |/  
//        |  |  |_/|_/|__/|__/
//
// 
// This is the application running as `mill` command line interface.
// It is directly **require()**-d and **start()**-ed by the `./bin/mill` stub.

// The stub is the only 'real' shell script in this project. That means it is the
// only file directly called by the operating system. 
// That is also the reason it needs a "hashbang" as it's first line.
// 
// Condensed to its main functionality, the stub looks like this: ^[and btw it is just copied from [jitsu's cli](https://github.com/nodejitsu/jitsu/blob/master/bin/jitsu)]:
// 
// ```js
// #!/usr/bin/env node
// 
// var mill = require('../mill-cli.js');
// 
// mill.start(function (err) {
//   process.exit(err ? 1 : 0);
// });
// ```
// 
//  ---

// # SETUP
// 
// *The setup process is idiomatic for every nodejs file in this project, so it is only verbosely annotated here*
// 
// Since we start from nothing, we need to require some modules.
// 
// Some of them come from the `node.js` core, they can be required without installing them. 
// 
// - we need *path* for working with paths.
var path = require('path'),

// *A Note about external modules:* After `npm install --save something` in the app dir, they are installed in the sub-folder 'node_modules', thus will be found *automagically*. The `--save` falgs also instructs `npm` to write this 'dependency' to the `package.json` file.
// 
// Now, we `require()` our external modules.
// - the *flatiron* anti-framework 
    flatiron = require('flatiron');

//  
// # {APP}
// 
// We start out with an 'app' object, which we get from the `flatiron` module.


var app = mill = module.exports = flatiron.app;
// This is a "injection container", provided by the ['broadway' module](https://github.com/flatiron/broadway).
// This means plugins can modify the app object directly.
// Where do these plugins come from?
// - some are built-in and already activated by flatiron: (`log`, `conf`, `router`)
// - some are built-in, but need to be activated (`http`, `cli`, …)
// - Your own plugins need to activated as well
// From flatiron, we get a bunch of stuff (but not too much)

// 
// # Configuration
// 
// Before doing anything with our `app`, we load the configuration. app.config is another built-in part of flatiron: the [`nconf` module](https://github.com/flatiron/nconf)
// In short, it allows us to use 3 pre-configured sources where our configuration could come from:
// - a `JSON` file, ie. `./config.json` -> `{ "foo": 1337 }`
// - the environment variables of the process, ie. `$ export foo=1337 && mill`
// - command line flags, ie. `mill --foo 1337`
// 
// The order in which we load the config specifies the order in which they are used! First is more important than second, etc.
// You can think of the config file as default settings, the environment variables as per-system setting and command line arguments as per-run settings, thus they are used in that order.
//

app.config.argv(); // conf source: arguments is most important
app.config.env();  // then env vars
app.config.file('file', path.join(__dirname, 'config', 'config.json')); // lastly, our config.json file
// FIXME: set the dir manually 
app.config.set('cwd', process.cwd());
  
// - also use the "cli" plugin (enables lazy-loading commands and color output)
app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  
  // # Usage
  
  // The 'usage' information will be show when no (valid) command was given.
  "notFoundUsage": true,
  
  // It is an array of strings, which will be seperated by line breaks.
  // We start by getting our ASCII logo (if found), and append the text to that.
  usage: (Array.isArray(app.config.get('banner')) ? app.config.get('banner') : []).concat([
    'Commands:',
    'mill new "Project Title" [-s paper|simple]     Setup a new project',
    'mill print [/path/to/project]                  Output project to PDF',
    'mill web [/path/to/project]                    Output project to HTML',
    'mill help <command>                            Show more help',
    ''
  ]),
});

// 
// We also use our own modules: 
// 
// - Utility functions
app.use(require('./lib/utils'));
// - Command Shortcuts
require('./lib/alias');

// The CLI can be run in debug mode. 
// We detect if the user wants it and set a variable for it to use throughout the program.
if (app.config.get('debug') || app.config.get('DEBUG:on')) {
  app.DEBUG = true;
}


// Turn CLI colors off on request (`--no-colors`, `{ "colors": true }`) 
// - [from `jitsu`](https://github.com/nodejitsu/jitsu/blob/5ee65b1c3af27ca6c17664add9dea537cce8f0aa/lib/jitsu.js#L163)
if (!app.config.get('colors')) {
  
  // app needs to be inited before we can set up the log
  app.init(function (err, res) {
    app.log.get('default').stripColors = true;
    app.log.get('default').transports.console.colorize = false;
  });
}

// 
// This finishes the **mill** `CLI`.
// 