gulp-ember-templates
====================

Gulp plugin for compiling ember.js templates

Usage
====================

Start by installing ``` gulp-ember-templates ```

```
npm install --save-dev gulp-ember-templates
```

Then you can use the plugin in your ```gulpfile.js```

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var emberTemplates = require('gulp-ember-templates');

gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(concat('ember-templates.js'))
    .pipe(emberTemplates())
    .pipe(gulp.dest('./some/other/place'));
});
```
Note: ``` concat ``` is not mandatory, however this will produce a single file
to reference in your html page.

Todo
====================

* Output formats
  * CJS
* Config
  * Handlebars compiler options - passed to ``` Ember.Handlebars.precompile() ```
