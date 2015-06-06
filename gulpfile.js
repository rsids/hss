(function () {
    'use strict';

    var gulp = require('gulp');

    gulp.task('default', function() {

    });


    gulp.task('build', function() {

        gulp.src('app/js/**/*.js')
            .pipe(minify())
            .pipe(gulp.dest('build'));
    })
}());