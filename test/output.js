var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec;

var mill = path.resolve(__dirname, '../bin/mill'),

  base = {
    'sample': 'fixtures/samples/',
    'spec': 'fixtures/specs/'
  },
  
  fixtures = [
    { "nr": "1", "out": "_output" }
    // ,{ "nr": "2", "out": "_output" }
  ];

var suite = vows.describe('The mill CLI').export(module); // Setup/export the Suite

fixtures.forEach(function (fix) {
  
  // make test data
  fix.sample = path.join(__dirname, base.sample, fix.nr);
  fix.spec = path.join(__dirname, base.spec, fix.nr)
  fix.output = path.join(__dirname, fix.out),
  
  // cleanup before test
  fs.removeSync(path.join(fix.sample, '_output'));
  
  suite.addBatch({
    
    'An output command': {
      topic: function() {
        var callback = this.callback;
        exec(mill + ' output ' + fix.sample, function (err, res) {
          console.log(err || res);
          callback(err || null, res || null);
        });
      },
      'creates a file.': {
        topic: function () {
          fs.exists(path.join(fix.sample, '_output', 'doc.html'), this.callback)
        },
        'which exists': function (topic) {
          assert.ok(topic)
        },
      
        'We read it': {
          topic: function () {
            fs.readFile(path.join(fix.sample, '_output', 'doc.html'), {encoding:'utf8'}, this.callback);
          },
          'it has content': function (topic) {
            assert.ok(topic.length);
          },
          'and compare with the spec': {
            topic: function (result) {
              var spec = fs.readFileSync(spec, {encoding:'utf8'});
              this.callback({'spec': fix.spec, 'result': fix.result})
            },
            'and they should be the same': function (topic) {
              assert.strictEqual(topic.spec, topic.result);
            }
          }        
        }
      }
    }

  });
  
});

