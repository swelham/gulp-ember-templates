var test_helpers = require('./test-helpers');

describe('amd output', function () {
  it('should compile templates', function (done) {
      var expectedFileName = 'simple_expectation.js';
      var options = { 
        type: 'amd' 
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });

    it('should compile templates with no custom module name', function (done) {
      var expectedFileName = 'simple_no_custom_module_name_expectation.js';
      var options = { 
        type: 'amd',
        moduleName: ''
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });

    it('should compile templates with custom module name', function (done) {
      var expectedFileName = 'simple_custom_module_name_expectation.js';
      var options = { 
        type: 'amd',
        moduleName: 'custom/name'
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });

    it('should compile templates with custom module name ending with /', function (done) {
      var expectedFileName = 'simple_custom_module_name_expectation.js';
      var options = { 
        type: 'amd',
        moduleName: 'custom/name/'
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });

    it('should compile templates with custom name', function (done) {
      var expectedFileName = 'simple_custom_name_expectation.js';
      var options = { 
        type: 'amd',
        name: 'custom_name'
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });
    
    it('should compile templates with a regex transformed name', function (done) {
      var expectedFileName = 'simple_regex_transformed_name_expectation.js';
      var options = { 
        type: 'amd',
        name: {
          replace: /_/g,
          with: '/'
        }
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });
    
    it('should compile templates with a function transformed name', function (done) {
      var expectedFileName = 'simple_function_transformed_name_expectation.js';
      var options = { 
        type: 'amd',
        name: function (name, done) {
          var parts = name.split('_');
          var transformedName = parts[1] + '_' + parts[0];

          done(null, transformedName);
        }
      };

      test_helpers.assertAMDTemplate(options, expectedFileName, done);
    });
});
