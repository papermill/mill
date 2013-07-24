// # mill **new**
//
// > Create and set up a new project.
// 
// ---

// ## Usage Information
// 
// This is displayed when the user requests help on this command.
var usage = [
  'Create a new writing project with the name you choose',
  'and some content to get you started.',
  'Optionally choose a stationery (default is Paper).',
  '',
  'Available stationaries:',
  '* Simple',
  '* Paper',
  '',
  'Usage: mill create <NAME> [<stationery>]',
  '',
  'Example usages:',
  'mill new "Lorem Ipsum"',
  'mill new "Comparative Lorem Ipsum" paper'  
];


// ## Workflow: **create**

// this function gets called by the cli app when the user runs the **create** command.
function create (argument, callback) {
  
  // Our context is set to the application, we save it in a variable for convenience.
  var app = this;
  
  // Testing the command chain with argument.
  mill.log.debug("Hello " + argument + "!");
  
  // - get the stationery url
  //     - maybe user has config
  //     - if not, use default

  var stat = app.config.stationery;
  
  // - check for needed configuration, fail if it is missing
  if (!stat) {
    return app.fail('No stationery found!', callback)
  }
  else if (!stat.url) {
    return app.fail('No stationery URL found!', callback)
  }
  
  // - fetch the stationery from url
  fetch(stat.url, function(err, res, body){
    if (stationery.url ) {};
  });
  
  
  callback();
};

// The whole command workflow lies in 1 main function,
// which we also export as a module;
create.usage = usage;
module.exports = create;

