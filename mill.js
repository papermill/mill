#!/usr/bin/env node

var flatiron = require('flatiron'),
    path = require('path');
    
var app = mill = module.exports = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  
  // The 'usage' will be show when no (valid) command was given.
  "notFoundUsage": true,
  
  // It is an array of strings which will be seperated by line breaks.
  usage: [
    '              _   _  ',
    '          o  | | | | ',
    '_  _  _      | | | | ',
    ' |/ |/ |  |  |/  |/  ',
    ' |  |  |_/|_/|__/|__/',
    '',
    'Commands:',
    'mill new "Project Title" [-s paper|simple]     Setup a new project',
    'mill print [/path/to/project]                  Output project to PDF',
    'mill web [/path/to/project]                    Output project to HTML',
    'mill help <command>                            Show more help',
    ''
  ],
});

// mill.start();

// mill.log.debug(__dirname);