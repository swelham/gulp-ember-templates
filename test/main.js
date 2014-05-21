var path = require('path');
var fs = require('fs');
var should = require('should');
var gutil = require('gulp-util');
var plugin = require('../');
var es = require('event-stream');
var File = require('vinyl');

function readFixture (fileName) {
  filePath = path.join('test', 'fixtures', fileName);

  return new gutil.File({
    path: filePath,
    cwd: path.join('test', 'fixtures'),
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

function readExpectation (fileName) {
  return fs.readFileSync(path.join('test', 'expectations', fileName), 'utf8');
}

describe('gulp-ember-templates', function () {
  describe('plugin()', function () {

    it('should compile a valid ember handlebars template', function (done) {
      var stream = plugin();
      var template = readFixture('simple_fixture.hbs');

      stream.on('data', function (file) {
        var fileContent = file.contents.toString();
        var expectedContent = readExpectation('simple_expectation.js');

        should(file.isBuffer()).ok;
        fileContent.should.equal(expectedContent);
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

  });
});