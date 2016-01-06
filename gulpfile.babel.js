import bg from 'gulp-bg';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import webpackBuild from './webpack/build';
import fs from 'fs-extra';

const linting = require('./linting.babel');

const runEslint = () => {
  return gulp.src([
      'gulpfile.babel.js',
      'src/**/*.js',
      'webpack/*.js'
      // '!**/__tests__/*.*'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
};

// Always use Gulp only in development
gulp.task('set-dev-environment', () => {
  process.env.NODE_ENV = 'development'; // eslint-disable-line no-undef
});

gulp.task('build', (done) => {
  fs.removeSync('build');
  webpackBuild(done);
});

gulp.task('server-hot', bg('node', './webpack/server'));

gulp.task('server', ['set-dev-environment', 'server-hot'], bg('./node_modules/.bin/nodemon', './src/server'));

gulp.task('default', () => {
  runSequence(['server', 'watch', 'images'], 'lintAll');
});
