var compiler = require('ember-template-compiler');
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');
var path = require('path');

const PLUGIN_NAME = 'gulp-ember-templates';

var defaultOptions = {
  type: 'browser',
  moduleName: 'templates'
};

var formats = {
  browser: function (compilerOutput, options) {
    var prefix = 'Ember.TEMPLATES["application"] = Ember.Handlebars.template(';
    var suffix = ');';

    return prefix + compilerOutput.toString() + suffix;
  },
  amd: function (compilerOutput, options) {
    var moduleName = '';

    if (options.moduleName) {
      moduleName = options.moduleName;

      if (moduleName[moduleName.length - 1] !== '/') {
        moduleName += '/';
      }
    }

    var prefix = 'define("' + moduleName + options.name + '", function () { return ';
    var suffix = ' });';

    var compilerOutput = formats.browser(compilerOutput, options);

    return prefix + compilerOutput.toString() + suffix;
  }
};

function compile(options) {
  options = merge(true, defaultOptions, options);

  var stream = through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      return cb(new Error(PLUGIN_NAME + ': streaming is not supported'));
    }

    if (options.type === 'amd' && !options.name) {
      var fileName = file.relative;
      var ext = path.extname(fileName);

      options.name = fileName.slice(0, -ext.length);
    }

    try {
      var compilerOutput = compiler.precompile(file.contents.toString());
    }
    catch (e) {
      return cb(e);
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(formats[options.type](compilerOutput, options));
    }

    this.push(file);
    return cb();
  });

  return stream;
}

module.exports = compile;