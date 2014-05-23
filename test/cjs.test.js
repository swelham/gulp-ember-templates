var test_helpers = require('./test-helpers');

describe('cjs output', function () {
  it('should compile templates', function (done) {
    var expectedFileName = 'simple_expectation.js';
    var options = { 
      type: 'cjs'
    };

    test_helpers.assertCJSTemplate(options, expectedFileName, done);
  });
  
  it('should compile templates with custom name', function (done) {
    var expectedFileName = 'simple_custom_name_expectation.js';
    var options = {
      type: 'cjs',
      name: 'custom_name'
    };

    test_helpers.assertCJSTemplate(options, expectedFileName, done);
  });
  
  it('should compile templates with a regex transformed name', function (done) {
    var expectedFileName = 'simple_regex_transformed_name_expectation.js';
    var options = {
      type: 'cjs',
      name: {
        replace: /_/g,
        with: '/'
      }
    };

    test_helpers.assertCJSTemplate(options, expectedFileName, done);
  });
  
  it('should compile templates with a function transformed name', function (done) {
    var expectedFileName = 'simple_function_transformed_name_expectation.js';
    var options = {
      type: 'cjs', 
      name: function (name, done) {
        var parts = name.split('_');
        var transformedName = parts[1] + '_' + parts[0];

        done(null, transformedName);
      }
    };

    test_helpers.assertCJSTemplate(options, expectedFileName, done);
  });
});
