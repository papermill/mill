// # mill **output**
// 
// > renders a papermill project for print or web

// ---

// Variables setup
// 
// - we require our own `mill` library
var mill = require('../../mill-cli'),
// - we export ourselves as CommonJS module
    output = exports;

// # Usage
// 
// define usage information for this command
output.usage= [
  'Renders a papermill project according to settings.',
  'Can export to PDF (print) and HTML (web)',
  '',
  'Usage: mill output <project> [--format]'
  '',
  'Example usages:',
  'mill print'  
  'mill output --print </path/to/project>'  
  'mill web'  
  'mill output --web .'  
];

// # Workflow: **output**

// use [`grunt`](http://gruntjs.com/configuring-tasks) ?

// - get working directory

// - get papermill project config for working directory

// - read files from working directory

// - recurse into all all sub-folders