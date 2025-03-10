const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

const paths = {
    html: './src/index.html',
    css: './src/style.css',
    js: './src/script.js',
    images: './src/images/**/*',
    dist: './dist'
};

gulp.task('html', () => {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('css', () => {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src(paths.js)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('images', () => {
    return gulp.src('./src/images/**/*.{jpg,jpeg,png,gif,svg}')
        .pipe(gulp.dest('./dist/images'));
});


gulp.task('serve', () => {
    browserSync.init({
        server: paths.dist
    });

    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.css, gulp.series('css'));
    gulp.watch(paths.js, gulp.series('js'));
    gulp.watch(paths.images, gulp.series('images'));
});

gulp.task('default', gulp.series('html', 'css', 'js', 'images', 'serve'));
