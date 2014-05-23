var compiler = require('ember-template-compiler');
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge');
var path = require('path');
var async = require('async');

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
  },
  cjs: function (compilerOutput, fileName, options) {
    var prefix = 'module.exports = ';

    var compilerOutput = formats.browser(compilerOutput, fileName, options);

    return prefix + compilerOutput.toString();
  }
};

function transformName (name, options, done) {
  var transformedName = name;

  if (options.name) { 
    switch (typeof options.name)
    {
      case 'string':
        transformedName = options.name;
        break;
        
      case 'object':
        transformedName = name.replace(options.name.replace, options.name.with);
        break;

      case 'function':
        options.name(name, function (err, newName) {
           if (err) return done(err);

           transformedName = newName;
        });
        break;
    }
  }

  done(null, transformedName);
}

function compileTemplate (fileContents, done) {
    var compilerOutput;
        
    try {
      compilerOutput = compiler.precompile(fileContents);
    }
    catch (e) {
      return done(e);
    }

    done(null, compilerOutput);
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
    var self = this;
    
    async.series([
      function (done) {
        transformName(fileName, options, done);
      },
      function (done) {
        compileTemplate(file.contents.toString(), done);
      }],
      function (err, results) {
        if (err) {
          return cb(err);
        }

        if (file.isBuffer()) {
          file.contents = new Buffer(formats[options.type](results[1], results[0], options));
        }

        self.push(file);
        return cb();
      }
    );
  });

  return stream;
}

module.exports = compile;