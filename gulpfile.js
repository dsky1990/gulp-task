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
// scss lint
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');
//css sprite
gulp.task('css-sprite', function(){
  return gulp.src('build/icon/*')
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'icon.css',
        imgPath:'../images/sprite.png'
      }))
      .pipe(gulpif('*.png', gulp.dest('build/images/'), gulp.dest('build/sass/')));
});
//imagemin
gulp.task('imagemin',['css-sprite'], function(){
  return gulp.src('build/images/*')
      .pipe(changed('build/images/*'))
      .pipe(imagemin({
        progressive: true,
        interlaced: true,
        use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/images'));
});
//sass lint
gulp.task("scss-lint", function() {
  var processors = [
    stylelint(),
    reporter({
      clearMessages: true
    })
  ];
  return gulp.src('build/sass/*.scss')
      .pipe(postcss(processors, {syntax: syntax_scss}));
});
//sass to css
gulp.task('sass-to-css', ['scss-lint'], function(){
  return gulp.src('build/sass/*.scss')
      .pipe(changed('build/sass/*'))
      .pipe(sourceMaps.init())
      .pipe(sass().on('error', function (e) {
        console.error(e.message);
      }))
      .pipe(autoPrefixer({
        browsers: ['last 99 versions'],
        cascade: false
      }))
      .pipe(sourceMaps.write('../../dist/css/maps'))
      .pipe(gulp.dest('build/css'));
});

//concat
gulp.task('concat', function() {
  return gulp.src('build/sass/*.scss')
    .pipe(concat('style.scss'))
    .pipe(gulp.dest('build/sass'));
});

//css minify
gulp.task('minify-css', function() {
  return gulp.src('build/css/*.css')
      .pipe(changed('build/css/*.css'))
      // .pipe(assetRev())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('dist/css'));
});
//js lint
gulp.task('eslint', function () {
  return gulp.src(['build/js/*.js'])
      .pipe(changed('build/js/*.js'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
// js minify
gulp.task('jscompress',['eslint'], function (cb) {
  pump([
        gulp.src('build/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
      ],
      cb
  );
});

// watch icon
gulp.task('watch-icon', function (done) {
  gulp.watch('./build/icon/*', ['css-sprite'])
      .on('end', done);
});
// watch img
gulp.task('watch-img', function (done) {
  gulp.watch('./build/images/*', ['imagemin'])
      .on('end', done);
});
//watch sass
gulp.task('watch-sass', function (done) {
  gulp.watch('./build/sass/*', ['sass-to-css'])
      .on('end', done);
});
//watch css
gulp.task('watch-css', function (done) {
  gulp.watch('./build/css/*', ['minify-css'])
      .on('end', done);
});
//watch js
gulp.task('watch-js', function (done) {
  gulp.watch('./build/js/*.js', ['jscompress'])
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