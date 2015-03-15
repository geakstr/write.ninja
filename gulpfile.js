var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  run = require('gulp-run');

gulp.task('dev', ['stylus-dev', 'lmd-dev', 'move', 'watch']);

gulp.task('stylus-dev', function() {
  gulp.src('app/private/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('app/public/static/css'));
});

gulp.task('lmd-dev', function() {
  run('lmd build dev').exec();
});

gulp.task('move', function() {
  gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/jquery/dist/jquery.min.map',
  ]).pipe(gulp.dest('./app/public/static/vendor'));
});

gulp.task('watch', function() {
  gulp.watch('app/private/stylus/*.styl', ['stylus-dev']);
  gulp.watch('app/private/js/*.js', ['lmd-dev']);
});
