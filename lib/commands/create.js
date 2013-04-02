// # mill **new**
//
// > Create and set up a new project.
// 
// ---

// ## Usage Information
// 
// This is displayed when the user requests help on this command.
create.usage = [
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

// The whole command workflow lies in 1 main function,
// which we also export as a module;
module.exports = create;

// this function gets called by the cli app when the user runs the **create** command.
function create (argument, callback) {
  
  // Our context is set to the application, we save it in a variable for convenience.
  var app = this;
  
  // Testing the command chain with argument.
  mill.log.debug("Hello " + argument + "!");
  
  // - get the stationery url
  //     - maybe user has config
  //     - if not, use default

  // var stationery = {};
  // stationery.name = mill.config.stationery_name || "Paper";
  // `stationery.url` defines the location and the protocol of the stationery source
  // - protocol: `HTTP(S)` or `git`. When using git over HTTP, URL has to end in .git
  // - stationery is fetched according to the determined protocoll
  // stationery.url = mill.config.stationery_url || "https://github.com/papermill/stationery.git";

  // - fetch the stationery from url
  // fetch(stationery.url, function(err, res, body){
    // if (stationery.url ) {};
  // });
  
  
  callback();
};
