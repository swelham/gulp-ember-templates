var path = require('path');
var fs = require('fs');
var should = require('should');
var plugin = require('../');
var gutil = require('gulp-util');

function readFixture (fileName) {
  filePath = path.join('test', 'fixtures', fileName);

  return new gutil.File({
    path: filePath,
    cwd: path.join('test', 'fixtures'),
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

function readExpectation (outputType, fileName) {
  return fs.readFileSync(path.join('test', 'expectations', outputType, fileName), 'utf8');
}

assertTemplate = function (outputType, options, expectedFileName, done) {
  var expectedContent = readExpectation(outputType, expectedFileName);
  var stream = plugin(options);
  var template = readFixture('simple_fixture.hbs');
  
  stream.on('data', function (file) {
    var fileContent = file.contents.toString();

    should(file.isBuffer()).ok;
    fileContent.should.equal(expectedContent);
    done();
  });

  stream.write(template);
};

module.exports.assertBrowserTemplate = function (options, expectedFileName, done) {
  assertTemplate('browser', options, expectedFileName, done);
};

module.exports.assertAMDTemplate = function (options, expectedFileName, done) {
  assertTemplate('amd', options, expectedFileName, done);
};