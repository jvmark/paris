var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var del = require('del');
var staticHash = require('gulp-static-hash');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var RevAll = require('gulp-rev-all');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var runSequence = require('gulp-run-sequence');
var moment = require('moment');
var gutil = require('gulp-util');
var path = require('path');
var logger = require('gulp-logger');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;
var shell = require('gulp-shell');
var exec = require('child_process').exec;

console.dir(argv);

var version = moment().format('YYYYMMHHmmss');
var package_path = path.join(__dirname, '../build/', version);

gulp.task('usemin', function() {
  return gulp.src('../src/*.handlebars')
    .pipe(usemin({
      // css: [rev()],
      // js: [rev()]
    }))
    .pipe(gulp.dest(package_path));
});

gulp.task('copyfiles', function() {
  return gulp.src(['../src/**/*',
      '!../src/static/js/**/*.js',
      '!../src/static/css/**/*.css',
      '!../src/index.handlebars',
      '!.git'
    ])
    .pipe(gulp.dest(package_path));
});

gulp.task('build', function(cb) {
  if (argv.list) {
    var srcpath = path.join(__dirname, '../build/');
    var dirs = fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
    gutil.log("所有版本：\n" + dirs.join("\n"));
  } else if (argv.start) {
    var version = argv.start;
    var srcpath = path.join(__dirname, '../build/', version + '');
    if (!fs.existsSync(srcpath)) {
      gutil.log('这个版本的包不存在');
      return;
    }
    var child = require('child_process');
    var du = child.spawn('node', ['app.js'], {
      cwd: srcpath
    });
    du.stdout.on('data', function(data) {
      gutil.log(data.toString().trim());
    });
    du.stderr.on('data', function(data) {
      gutil.log(data.toString().trim());
    });
    du.on('exit', function(code) {
      gutil.log('exit ' + code);
    });
  } else if (argv.publish) {
    var version = argv.publish;
    var srcpath = path.join(__dirname, '../build/', version + '');
    gutil.log(srcpath);
    if (!fs.existsSync(srcpath)) {
      gutil.log('这个版本的包不存在');
      return;
    }
    exec('rm -f /box/apps/paris && ln -s ' + srcpath + ' /box/apps/paris', function(err, stdout, stderr) {
      // if (err) throw err;
      gutil.log(stdout);
      exec('supervisorctl restart paris', function(err, stdout, stderr) {
        if (err) throw err;
        gutil.log(stdout);
      });
    });
  } else if (argv.preview) {
    var version = argv.preview;
    var srcpath = path.join(__dirname, '../build/', version + '');
    gutil.log(srcpath);
    if (!fs.existsSync(srcpath)) {
      gutil.log('这个版本的包不存在');
      return;
    }
    exec('rm -f /box/apps/paris.preview && ln -s ' + srcpath + ' /box/apps/paris.preview', function(err, stdout, stderr) {
      // if (err) throw err;
      gutil.log(stdout);
      exec('supervisorctl restart paris.preview', function(err, stdout, stderr) {
        if (err) throw err;
        gutil.log(stdout);
      });
    });
  } else {
    gutil.log('版本路径：' + package_path);
    runSequence('usemin', 'copyfiles');
  }
});