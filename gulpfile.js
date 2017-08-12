// base
const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');

// css
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// dev dep
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");


// source and distribution folder
let source = './', dest = './';

// bootstrap 模块根路径
let bootstrapModuleRootPath = './node_modules/bootstrap-sass/';
let jqueryModuleRootPath = './node_modules/jquery/';

// 复制 jquery js 到生产目录
gulp.task('jq-js', function () {
    return gulp
        .src(jqueryModuleRootPath + 'dist/jquery.min.js')
        .pipe(gulp.dest(dest + 'js/bootstrap'));
});

// 复制 bootstrap js 到生产目录
gulp.task('bs-js', function () {
    return gulp
        .src(bootstrapModuleRootPath + 'assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest(dest + 'js/bootstrap'));
});

// 复制 bootstrap fonts 到生产目录
gulp.task('bs-fonts', function () {
    return gulp
        .src(bootstrapModuleRootPath + 'assets/fonts/**/*')
        .pipe(gulp.dest(dest + 'fonts/'));
});

// 编译 scss
let scss = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'compressed',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapModuleRootPath + 'assets/stylesheets']
    }
};
gulp.task('sass', ['jq-js', 'bs-js', 'bs-fonts'], function () {
    return gulp.src(scss.in)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass(scss.sassOpts))
        .pipe(autoprefixer({
            browsers: ['last 10 versions', 'ie 7-11', 'Android >= 4.0', 'iOS >= 7'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(scss.out))
        .pipe(browserSync.stream());
});

// default
gulp.task('default', ['sass'], function () {

    browserSync.init({
        server: "./",
        startPath: './html/',
        notify: false
        /*browser: ["/Applications/Google\\ Chrome.app"],*/
    });

    gulp.watch(scss.watch, ['sass']);

    gulp.watch("html/**/*.html").on('change', browserSync.reload);

});