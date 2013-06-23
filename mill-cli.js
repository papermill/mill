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
// Condensed to its main functionality, the stub looks like this 
// <small>(and btw it is just copied from [jitsu's cli](https://github.com/nodejitsu/jitsu/blob/master/bin/jitsu))</small>:
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

// First, we need to **require()** some modules from:
// 
// - the `node.js` core
//     * *path* for working with paths
var path = require('path'),
// - the npm registry (these need to be declared as dependencies in `package.json`, so they will be **install**ed by `npm`)
//     * the *flatiron* anti-framework 
    flatiron = require('flatiron');
// - (some modules will be built in) 

// We are a flatiron app!!!11!! So proud.
var app = mill = module.exports = flatiron.app;

// From flatiron, we get a bunch of stuff (but not too much)
// - configuration management by nconf // TODO: move to module
app.config.file({ file: path.join(__dirname, 'config', 'config.json') });
  
// - also use the "cli" plugin (enables lazy-loading commands and color output)
app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  
  // # Usage
  
  // The 'usage' information will be show when no (valid) command was given.
  "notFoundUsage": true,
  
  // It is an array of strings, which will be seperated by line breaks.
  // We start it with our ASCII logo, and append the text to that.
  usage: app.config.get('banner').concat([
    'Commands:',
    'mill new "Project Title" [-s paper|simple]     Setup a new project',
    'mill print [/path/to/project]                  Output project to PDF',
    'mill web [/path/to/project]                    Output project to HTML',
    'mill help <command>                            Show more help',
    ''
  ]),
});

// 
// We also use our own modules
// 
// - Utility functions
app.use(require('./lib/utils'));
// - Command Shortcuts
require('./lib/alias');

// 
// This finishes the **mill** `CLI`.
// 