gulp-ember-templates
====================

Gulp plugin for compiling ember.js templates

Usage
====================
Start by installing ``` gulp-ember-templates ```

```
npm install --save-dev gulp-ember-templates
```

Then you can use the plugin in your ```gulpfile.js``` to output your templates
in one the following formats

###Browser Output

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var emberTemplates = require('gulp-ember-templates');

gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates())
    .pipe(concat('ember-templates.js')) // make sure to only do concat after
    .pipe(gulp.dest('./some/other/place'));
});
```

Note: ``` concat ``` is not mandatory, however this will produce a single file
to reference in your html page. This must appear after the call to the 
``` gulp-ember-templates ```

###AMD Output

```
var gulp = require('gulp');
var emberTemplates = require('gulp-ember-templates');

gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      type: 'amd'
    }))
    .pipe(gulp.dest('./some/other/place'));
});
```

API Options
====================

###options.type

Type: ``` String ```,
Default: ``` browser ```

This options specifies the output type that will be used. Available types
* ``` browser ``` - Output plain JavaScript files
* ``` amd ``` - Output AMD modules

###options.moduleName

Type: ``` String ```,
Default: ``` templates ```

This options specifies the root module name and is only used
when using the ``` options.type ``` of ``` amd ```

Note: You can specify an empty string if you wish to use the template file name
for the module name

###options.name

Type ``` String ```,
Default: the template file name

This options specifies the name to be appended to the
``` options.moduleName ``` and is only used
when using the ``` options.type ``` of ``` amd ```

Todo
====================

* Output formats
  * CJS
* Config
  * Handlebars compiler options - passed to ``` Ember.Handlebars.precompile() ```
  * File name transform
