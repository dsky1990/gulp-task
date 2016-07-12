/**
 * Created by dsky on 16/6/22.
 * gulp task to make development quick
 * css sprite, imagemin, sass lint && sass to css, css minify, js minify
 */
'use strict';
var gulp = require('gulp');
var gulpif = require('gulp-if');
var changed = require('gulp-changed');
var sass = require('gulp-sass');//sass
var autoPrefixer = require('gulp-autoprefixer');//css3前缀
var spritesmith = require('gulp.spritesmith');//css sprite
var cleanCSS = require('gulp-clean-css');//压缩css
var mocha = require('gulp-mocha');//js 单元测试
var pump = require('pump');
var uglify = require('gulp-uglify');//压缩js
var eslint = require('gulp-eslint');//js 测试
var imagemin = require('gulp-imagemin');//压缩img
var pngquant = require('imagemin-pngquant');//png 压缩
var sourceMaps = require('gulp-sourcemaps');//sourcemaps
var concat = require('gulp-concat'); // 文件合併
var browserSync = require('browser-sync').create();
var stripDebug = require('gulp-strip-debug'); // Strip console, alert, and debugger
// scss lint
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');
// file path
var buildImg = 'build/images/*';
var buildImgSrc = 'build/images/';
var buildSass = 'build/sass/*.scss';
var buildSassSrc = 'build/sass/';
var buildIcon = 'build/icon/*';
var buildCss = 'build/css/*.css';
var buildCssSrc = 'build/css';
var buildJs = 'build/js/*.js';
var distImgSrc = 'dist/images';
var distCssSrc = 'dist/css';
var distJsSrc = 'dist/js';
//css sprite
gulp.task('css-sprite', function(){
  return gulp.src(buildIcon)
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'icon.css',
        imgPath:'../images/sprite.png'
      }))
      .pipe(gulpif('*.png', gulp.dest(buildImgSrc), gulp.dest(buildSassSrc)));
});
//imagemin
gulp.task('imagemin',['css-sprite'], function(){
  return gulp.src(buildImg)
      .pipe(changed(buildImg))
      .pipe(imagemin({
        progressive: true,
        interlaced: true,
        use: [pngquant()]
      }))
      .pipe(gulp.dest(distImgSrc));
});
//sass lint
gulp.task("scss-lint", function() {
  var processors = [
    stylelint(),
    reporter({
      clearMessages: true
    })
  ];
  return gulp.src(buildSass)
      .pipe(postcss(processors, {syntax: syntax_scss}));
});
//sass to css
gulp.task('sass-to-css', ['scss-lint'], function(){
  return gulp.src(buildSass)
      .pipe(changed(buildSass))
      .pipe(sourceMaps.init())
      .pipe(sass().on('error', function (e) {
        console.error(e.message);
      }))
      .pipe(autoPrefixer({
        browsers: ['last 99 versions'],
        cascade: false
      }))
      .pipe(sourceMaps.write('../../dist/css/maps'))
      .pipe(gulp.dest(buildCssSrc));
});

//css minify
gulp.task('minify-css', function() {
  return gulp.src(['vendor/gentallela/custom.css', buildCss])
      .pipe(changed(buildCss))
      // .pipe(assetRev())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(concat('style.css'))
      .pipe(gulp.dest(distCssSrc));
});
//js lint
gulp.task('eslint', function () {
  return gulp.src(buildJs)
      .pipe(changed(buildJs))
      .pipe(stripDebug())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
// js minify
gulp.task('jscompress',['eslint'], function (cb) {
  pump([
        gulp.src(buildJs),
        stripDebug(),
        uglify(),
        gulp.dest(distJsSrc)
      ],
      cb
  );
});

// watch icon
gulp.task('watch-icon', function (done) {
  gulp.watch(buildIcon, ['css-sprite'])
      .on('end', done);
});
// watch img
gulp.task('watch-img', function (done) {
  gulp.watch(buildImg, ['imagemin'])
      .on('end', done);
});
//watch sass
gulp.task('watch-sass', function (done) {
  gulp.watch(buildSass, ['sass-to-css'])
      .on('end', done);
});
//watch css
gulp.task('watch-css', function (done) {
  gulp.watch(buildCss, ['minify-css'])
      .on('end', done);
});
//watch js
gulp.task('watch-js', function (done) {
  gulp.watch(buildJs, ['jscompress'])
      .on('end', done);
});
//前端开发版
gulp.task('watch', ['watch-icon', 'watch-img', 'watch-sass', 'watch-css', 'watch-js']);
// browser-sync
gulp.task('browser-sync',function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("./dist/**/*.*").on('change', browserSync.reload);
});
//gulp
gulp.task('default',['watch','browser-sync']);