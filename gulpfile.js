const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const connect = require('gulp-connect');

gulp.task('test', () => {
  gulp.src('test/**/*.js')
  .pipe(jasmine());
});

gulp.task('build', ['test'], () => {
  // gulp.src('src/**/*.js')
  return connect.reload();
});

gulp.task('dev', () => {
  connect.server({
    root: ['.tmp'],
    port: 3000
  });

  gulp.watch(['test/**/*.js'], ['test']);
  return gulp.watch(['src/**/*.js'], ['build']);
});
