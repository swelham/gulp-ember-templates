var es = require('event-stream');
var File = require('vinyl');
var plugin = require('../');

describe('exceptions', function () {
  it('should catch ember-template-compiler error for malformed template', function (done) {
    var stream = plugin();
    var template = new File({
      path: 'malformed.hbs',
      contents: new Buffer('Malformed {{template')
    });

    stream.on('error', function (err) {
      done();
    });

    stream.write(template);
  });

  it('should throw not supported error for streaming', function (done) {
    var stream = plugin();
    var template = new File({
      contents: es.readArray(['streaming'])
    });

    stream.on('error', function (err) {
      err.message.should.equal('gulp-ember-templates: streaming is not supported');
      done();
    });

    stream.write(template);
  });

  it('should handle error raised by options.name function transform', function (done) {
    var options = { 
      name: function (name, done) {
        done(new Error('test error'));
      }
    };

    var stream = plugin(options);
    var template = new File({
      contents: es.readArray(['transform'])
    });

    stream.on('error', function (err) {
      done();
    });

    stream.write(template);
  });
});
