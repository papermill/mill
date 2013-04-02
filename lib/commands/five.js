var highfive = module.exports = function highfive (person, callback) {
  this.log.info('High five to ' + person + '!');
  callback();
};

highfive.usage = [
  'Highfive somebody',
];
