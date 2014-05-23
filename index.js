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
  browser: function (compilerOutput, fileName, options) {
    var prefix = 'Ember.TEMPLATES["' + fileName + '"] = Ember.Handlebars.template(';
    var suffix = ');';

    return prefix + compilerOutput.toString() + suffix;
  },
  amd: function (compilerOutput, fileName, options) {
    var moduleName = '';

    if (options.moduleName) {
      moduleName = options.moduleName;

      if (moduleName[moduleName.length - 1] !== '/') {
        moduleName += '/';
      }
    }

    var prefix = 'define("' + moduleName + fileName + '", function () { return ';
    var suffix = ' });';

    var compilerOutput = formats.browser(compilerOutput, fileName, options);

    return prefix + compilerOutput.toString() + suffix;
  }
};

function transformName (name, options) {
  var transformedName = name;

  switch (typeof options.name)
  {
    case 'string':
      transformedName = options.name;
      break;
      
    case 'object':
      transformedName = name.replace(options.name.replace, options.name.with);
      break;
  }

  return transformedName;
}

function compile(options) {
  options = merge(true, defaultOptions, options);

  var stream = through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      return cb(new Error(PLUGIN_NAME + ': streaming is not supported'));
    }

    var ext = path.extname(file.relative);
    var fileName = file.relative.slice(0, -ext.length);

    if (options.name) {
      fileName = transformName(fileName, options);
    }

    var compilerOutput;
    
    try {
      compilerOutput = compiler.precompile(file.contents.toString());
    }
    catch (e) {
      return cb(e);
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(formats[options.type](compilerOutput, fileName, options));
    }

    this.push(file);
    return cb();
  });

  return stream;
}

module.exports = compile;