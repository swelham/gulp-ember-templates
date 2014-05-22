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

function assertSimpleTemplate (options, expectedContent, done) {
  var stream = plugin(options);
  var template = readFixture('simple_fixture.hbs');

  stream.on('data', function (file) {
    var fileContent = file.contents.toString();

    should(file.isBuffer()).ok;
    fileContent.should.equal(expectedContent);
    done();
  });

  stream.write(template);
}

describe('gulp-ember-templates', function () {
  describe('plugin()', function () {

    it('should output the complied templates in browser format when no options specified', function (done) {
      var expectedContent = readExpectation('simple_expectation.js');

      assertSimpleTemplate(undefined, expectedContent, done);
    });

    it('should output the complied templates in browser format', function (done) {
      var expectedContent = readExpectation('simple_expectation.js');
      var options = { 
        type: 'browser' 
      };

      assertSimpleTemplate(options, expectedContent, done);
    });

    it('should output the complied templates in AMD format', function (done) {
      var expectedContent = readExpectation('simple_amd_expectation.js');
      var options = { 
        type: 'amd' 
      };

      assertSimpleTemplate(options, expectedContent, done);
    });

    it('should output the complied templates in AMD format with custom module name', function (done) {
      var expectedContent = readExpectation('simple_amd_custom_module_name_expectation.js');
      var options = { 
        type: 'amd',
        moduleName: 'custom/name'
      };

      assertSimpleTemplate(options, expectedContent, done);
    });

    it('should catch ember-template-compiler error for malformed template', function (done) {
      var stream = plugin();
      var template = new File({
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

  });
});