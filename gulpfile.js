const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const jest = require('gulp-jest').default;

const paths = {
    html: './src/index.html',
    css: './src/style.css',
    js: './src/script.js',
    images: './src/images/**/*.{jpg,jpeg,png,gif,svg}',
    tests: './__tests__/*.test.js',
    dist: './dist'
};

// Таск для HTML
gulp.task('html', () => {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Таск для CSS
gulp.task('css', () => {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Таск для JS
gulp.task('js', () => {
    return gulp.src(paths.js)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Таск для зображень
gulp.task('images', () => {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.dist + '/images'));
});

// Таск для тестування через Jest
gulp.task('test', () => {
    return gulp.src(paths.tests)
        .pipe(jest({
            preprocessorIgnorePatterns: [
                "<rootDir>/dist/", "<rootDir>/node_modules/"
            ],
            automock: false
        }));
});

// Таск для запуску локального сервера
gulp.task('serve', () => {
    browserSync.init({
        server: paths.dist
    });

    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.css, gulp.series('css'));
    gulp.watch(paths.js, gulp.series('js'));
    gulp.watch(paths.images, gulp.series('images'));
});

// Оновлений default task із тестами 
gulp.task('default', gulp.series('html', 'css', 'js', 'images', 'test', 'serve'));
