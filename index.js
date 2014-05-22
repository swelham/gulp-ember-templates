var compiler = require('ember-template-compiler');
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');

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
    var prefix = 'define("' + options.moduleName + '", function () { return ';
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