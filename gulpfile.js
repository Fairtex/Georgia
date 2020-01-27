"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const posthtml = require("gulp-posthtml");
const svgstore = require("gulp-svgstore");
const include = require("posthtml-include");
const babel = require("gulp-babel");

gulp.task("css", function () {
  return gulp.src("src/sass/style.sass")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src('src/js/script.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.sass", gulp.series("css"));
  gulp.watch("src/index.html", gulp.series("refresh"));
  gulp.watch("src/js/script.js", gulp.series("js","refresh"));
});

gulp.task("images", function () {
  return gulp.src("src/assets/img/**/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest("src/assets/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/assets/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("src/assets/img"));
});

gulp.task("sprite", function() {
  return gulp.src("src/assets/img/icon-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/assets/img"));
});

gulp.task("html", function() {
  return gulp.src("src/index.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
      "src/assets/img/**/*",
      "src/libs/**/*"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "sprite", "html", "css", "js", "server"));
gulp.task("start", gulp.series("css", "server"));