var test_helpers = require('./test-helpers');

describe('es6 output', function () {
  it('should compile templates', function (done) {
    var expectedFileName = 'simple_expectation.js';
    var options = { 
      type: 'es6'
    };

    test_helpers.assertES6Template(options, expectedFileName, done);
  });
  
  it('should compile templates with custom name', function (done) {
    var expectedFileName = 'simple_custom_name_expectation.js';
    var options = {
      type: 'es6',
      name: 'custom_name'
    };

    test_helpers.assertES6Template(options, expectedFileName, done);
  });
  
  it('should compile templates with a regex transformed name', function (done) {
    var expectedFileName = 'simple_regex_transformed_name_expectation.js';
    var options = {
      type: 'es6',
      name: {
        replace: /_/g,
        with: '/'
      }
    };

    test_helpers.assertES6Template(options, expectedFileName, done);
  });
  
  it('should compile templates with a function transformed name', function (done) {
    var expectedFileName = 'simple_function_transformed_name_expectation.js';
    var options = {
      type: 'es6', 
      name: function (name, done) {
        var parts = name.split('_');
        var transformedName = parts[1] + '_' + parts[0];

        done(null, transformedName);
      }
    };

    test_helpers.assertES6Template(options, expectedFileName, done);
  });
});
