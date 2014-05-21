var compiler = require('ember-template-compiler');
var through = require('through2');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-ember-templates';
const TEMPLATE_PREFIX = 'Ember.TEMPLATES["application"] = Ember.Handlebars.template(';
const TEMPLATE_SUFFIX = ');';

function compile() {
  var stream = through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      return cb(new Error(PLUGIN_NAME + ': streaming is not supported'));
    }

    var compilerOutput = compiler.precompile(file.contents.toString());

    if (file.isBuffer()) {
      file.contents = new Buffer(TEMPLATE_PREFIX + compilerOutput.toString() + TEMPLATE_SUFFIX);
    }

    this.push(file);
    return cb();
  });

  return stream;
}

module.exports = compile;