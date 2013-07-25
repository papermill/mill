var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec;

var mill = path.resolve(__dirname, '../bin/mill'),
    sample = path.join(__dirname, 'fixtures/sample/'),
    out = path.join(sample, '_output', 'doc.html'),
    spec = path.join(__dirname, 'fixtures/spec/doc.html');

vows.describe('The mill CLI')
  .addBatch({
    
  'An output command': {
    topic: function() {
      var callback = this.callback;
      fs.remove(path.join(sample, '_output'), function(err, res) {
        if (err) callback(err);
        exec(mill + ' output ' + sample, callback);
      });
    },
    'creates a file.': {
      topic: function () {
        fs.exists(path.join(sample, '_output', 'doc.html'), this.callback)
      },
      'which exists': function (topic) {
        assert.ok(topic)
      },
      
      'We read it': {
        topic: function () {
          fs.readFile(out, {encoding:'utf8'}, this.callback);
        },
        'it has content': function (topic) {
          assert.ok(topic.length);
        },
        'and compare with the spec': {
          topic: function (result) {
            var spec = fs.readFileSync(spec, {encoding:'utf8'});
            this.callback({'spec': spec, 'result': result})
          },
          'and they should be the same': function (topic) {
            assert.strictEqual(topic.spec, topic.result);
          }
        }        
      }

    }
  }
})
  .export(module); // Export the Suite
