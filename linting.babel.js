import eslint from 'gulp-eslint';
import gulp from 'gulp';
import path from 'path';
import runSequence from 'run-sequence';


import fs from 'fs-extra';
import access from 'gulp-accessibility';
import validator from 'gulp-html';
import colors from 'colors/safe';
import request from 'request';
import plumber from 'gulp-plumber';
import sasslint from 'gulp-sass-lint';
import gulpif from 'gulp-if';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import childProc from 'child_process';

import statics from './statics.js';
import htmlLintIgnore from './.html-lint.js';

const runEslint = () => {
  return gulp.src([
      'src/**/*.js',
      'src/**/*.jsx',
      '!**/__tests__/*.*'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
};

gulp.task('eslint', () => {
  return runEslint();
});

gulp.task('eslint-ci', () => {
  // Exit process with an error code (1) on lint error for CI build.
  return runEslint().pipe(eslint.failAfterError());
});

gulp.task('karma-ci', (done) => {
  runKarma({singleRun: true}, done);
});

gulp.task('karma', (done) => {
  runKarma({singleRun: false}, done);
});

gulp.task('test', (done) => {
  runSequence('eslint-ci', 'karma-ci', 'build-webpack-production', done);
});

gulp.task('tdd', (done) => {
  // Run karma configured for TDD.
  runSequence('server', 'karma', done);
});

gulp.task('watch', () => {

  const writeLine = () =>
    console.log(colors.blue("--------------------------------------------------------------------------------"));

  gulp.watch(['./src/client/**/*.js', './src/client/**/*.jsx', './src/server/**/*.js']).on('change', () => {

    writeLine();

    setTimeout(() => {
      runSequence(['downloadStatics', 'eslint'], ['wcag', 'htmlLint']);
    }, 1000);
  });

  gulp.watch('./src/client/**/*.scss').on('change', () => {
    writeLine();
    runSequence('sass-lint');
  });

  gulp.watch('assets/img_src/**/*').on('change', () => {
    writeLine();
    runSequence('images');
  });

});

const downloadFromServer = function (downObj, onError, onSuccess) {

  request('http://localhost:8000/' + downObj.url)
    .on('error', onError)
    .on('end', onSuccess)
    .pipe(fs.createWriteStream('tmp/downloads/' + downObj.filename));

};

const waitForServer = function (attempt, onSuccess) {

  if (attempt < 50) {
    downloadFromServer({url: '', filename: 'heartbeat.html'}, () => {
      setTimeout(() => {
        waitForServer(attempt + 1, onSuccess)
      }, 250);
    }, () => {
      fs.removeSync('tmp/downloads/heartbeat.html');
      onSuccess();
    })
  } else {
    console.error(colors.red("Waited but couldn't connect to the localhost server for testing."));
  }

};

gulp.task('downloadStatics', (done) => {

  fs.ensureDirSync('tmp/downloads');
  fs.removeSync('tmp/downloads/*');

  let downloadCount = 0;

  const download = function (downObjs) {
    downObjs.forEach((downObj, index) => {
      downloadFromServer(downObj, () => {
        throw "Couldn't access url " + downObj.url;
      }, () => {
        downloadCount = downloadCount + 1;
        if (downloadCount == downObjs.length) {
          done();
        }
      })
    });
  };

  waitForServer(1, function () {
    download(statics);
  });

});

gulp.task('wcag', () => {
  gulp.src('tmp/downloads/**/*.html')
    .pipe(access({
      accessibilityLevel: 'WCAG2AA',
      reportLevels: {
        notice: false,
        warning: true,
        error: true
      },
      ignore: [
        ''
      ]
    }));
});

gulp.task('images', () => {
  return gulp.src('assets/img_src/**/*')
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })
    .pipe(gulp.dest('assets/img'));
});

gulp.task('htmlLint', function (done) {

  const path = 'tmp/downloads/*.html';

  const vnu = 'java -jar ' + __dirname + '/node_modules/gulp-html/vnu/vnu.jar ' + path;
  childProc.exec(vnu, function (err, stdout, stderr) {
    if (err !== null) {
      const errors = stderr.split("\n").filter(x => !!x);
      errors.forEach((error) => {
        const ignoreError = htmlLintIgnore.some( (regex) => {
          const result = regex.test(error);
          return result;
        });
        if (!ignoreError) {
          console.warn(colors.yellow(error));
        }
      });
    }
    done();
  });

});

gulp.task('sass-lint', function () {
  gulp.src(['./src/client/**/*.scss', '!./src/client/app/_foundation-settings.scss'])
    .pipe(sasslint({
      config: '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('lintAll', () => {
  runSequence(['downloadStatics', 'eslint', 'sass-lint'], ['wcag', 'htmlLint']);
});
