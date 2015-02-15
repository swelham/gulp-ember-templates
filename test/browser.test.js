var test_helpers = require('./test-helpers');

describe('browser output', function () {
  it('should compile templates', function (done) {
    var expectedFileName = 'simple_expectation.js';
    var options = {
      type: 'browser'
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });

  it('should compile templates with no options specified', function (done) {
    var expectedFileName = 'simple_expectation.js';

    test_helpers.assertBrowserTemplate(undefined, expectedFileName, done);
  });


  it('should compile templates with custom name', function (done) {
    var expectedFileName = 'simple_custom_name_expectation.js';
    var options = {
      name: 'custom_name'
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });

  it('should compile templates with a regex transformed name', function (done) {
    var expectedFileName = 'simple_regex_transformed_name_expectation.js';
    var options = {
      name: {
        replace: /_/g,
        with: '/'
      }
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });

  it('should compile templates with a function transformed name', function (done) {
    var expectedFileName = 'simple_function_transformed_name_expectation.js';
    var options = {
      name: function (name, done) {
        var parts = name.split('_');
        var transformedName = parts[1] + '_' + parts[0];

        done(null, transformedName);
      }
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });

  it('should compile templates with custom compiler', function (done) {
    var expectedFileName = 'simple_custom_compiler_expectation.js';
    var options = {
      compiler: {
        precompile: function() { return '/* noop */'; }
      }
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });

  it('should compile templates with custom compiler (htmlbars flag on)', function (done) {
    var expectedFileName = 'simple_custom_compiler_and_ishtmlbars_expectation.js';
    var options = {
      isHTMLBars: true,
      compiler: {
        precompile: function() { return '/* noop */'; }
      }
    };

    test_helpers.assertBrowserTemplate(options, expectedFileName, done);
  });
});
