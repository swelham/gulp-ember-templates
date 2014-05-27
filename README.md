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

```javascript
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

```javascript
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

###CJS Output

```javascript
var gulp = require('gulp');
var emberTemplates = require('gulp-ember-templates');

gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      type: 'cjs'
    }))
    .pipe(gulp.dest('./some/other/place'));
});
```

###ES6 Output

```javascript
var gulp = require('gulp');
var emberTemplates = require('gulp-ember-templates');

gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      type: 'es6'
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
* ``` cjs ``` - Output CJS modules
* ``` es6 ``` - Output ES6 modules

###options.moduleName

Type: ``` String ```,
Default: ``` templates ```

This options specifies the root module name and is only used
when using the ``` options.type ``` of ``` amd ```

Note: You can specify an empty string if you wish to use the template file name
for the module name

###options.name

Type ``` String|Object|Function ```,
Default: the template file name

This option allows you to specify a fixed name or a transform to be used for 
the template name

####usages

```javascript
var gulp = require('gulp');
var emberTemplates = require('gulp-ember-templates');

// 'string' usage - this is really only useful when compiling a single template
gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      name: 'some_static_name'
    }))
    .pipe(gulp.dest('./some/other/place'));
});

// 'object' usage - replace all '_' with '/'
gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      name: {
        replace: /_/g, // 'replace' is a regex used to find charaters to replace
        with: '/' // 'with' is the string to replace the matches with
      }
    }))
    .pipe(gulp.dest('./some/other/place'));
});

// 'function' usage
gulp.task('default', function () {
  gulp.src('./some/place/*.handlebars')
    .pipe(emberTemplates({
      name: function (name, done) {
        /*
          DO NOT throw errors from here, pass them in as the first
          argument to done
        */
        
        // do something with name and pass it into the callback
        
        done(null, name);
      }
    }))
    .pipe(gulp.dest('./some/other/place'));
});
```
