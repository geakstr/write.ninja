var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  run = require('gulp-run'),
  autoprefixer = require('gulp-autoprefixer'),
  jscs = require('gulp-jscs');

gulp.task('dev', ['stylus-dev', 'js-dev', 'move-dev', 'watch-dev']);

gulp.task('stylus-dev', function() {
  gulp.src('app/src/frontend/stylus/*.styl')
    .pipe(stylus({
      'include css': true,
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest('app/www/static/css'));
});

gulp.task('js-dev', function() {
  run('lmd build app').exec();
});

gulp.task('jscs', function() {
  return gulp.src('app/src/frontend/js/*.js')
    .pipe(jscs());
});

gulp.task('move-dev', function() {
  gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/jquery/dist/jquery.min.map',
  ]).pipe(gulp.dest('./app/www/static/vendor'));
});

gulp.task('watch-dev', function() {
  gulp.watch('app/src/frontend/stylus/*.styl', ['stylus-dev']);
  gulp.watch('app/src/frontend/js/*.js', ['js-dev']);
});