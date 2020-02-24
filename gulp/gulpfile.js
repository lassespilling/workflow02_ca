// :::::: Instructions ::::::
// 1. Run 'npm install' to get node_modules
// 2. Run 'gulp img' to optimize images (takes a while)
// 3. Run 'gulp' to build from app folder and run server from dist

const gulp = require('gulp'); // GULP
const { src, dest } = require('gulp'); // GULP
const sass = require('gulp-sass'); // CSS
const minifyCSS = require('gulp-csso'); // CSS
const htmlmin = require('gulp-htmlmin'); // HTML
const imagemin = require('gulp-imagemin'); // Minify images
const browserSync = require('browser-sync').create(); // Browser reload

// IMAGES
function optimg() { // Minify images
    return src('app/img/**/*.{jpg,jpeg,png,gif,svg}') // Source path
    .pipe(imagemin([ // Run module
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 60, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/img/')) // Destination psth
}
// HTML
function minify() {
    return src('app/*.html') // Source path
    .pipe(htmlmin({ collapseWhitespace: true , removeComments: true })) // Run module
    .pipe(dest('dist')) // Destination path
}
// WEBFONTS ??
function webfonts() {
    return src('app/fonts/**/*') // Source path
    .pipe(dest('dist/fonts/')) // Destination path
}
// CSS / SASS
function css() {
    return src('app/sass/*.scss') // Source path
    .pipe(sass()) // Compile sass to CSS
    .pipe(minifyCSS()) // Minify CSS
    .pipe(dest('dist/css')) // Destination path
    .pipe(browserSync.stream()); // Update browser without reload
}
// RELOAD
function browsersync() {
    browserSync.init({ // Initialize server
        server: "dist" // Folder to render files from
    });
}
// WATCH
function watch() { // Watch module
    // watch app folder
    gulp.watch('app/img/**/*').on('change', optimg); // Optimize new or changed images
    gulp.watch('app/sass/**/*.sass').on('change', css); // Compile sass
    gulp.watch("app/*.html").on('change', minify); // Minify CSS
    gulp.watch("app/fonts/**/*").on('change', browserSync.reload); // Reload on font file changes

    // Watch distribution folder
    gulp.watch('dist/img/**/*').on('change', browserSync.reload); // Reload browser to show new images
    gulp.watch("dist/**/*.html").on('change', browserSync.reload); // Reload browser to show HTML changes
    gulp.watch("dist/fonts/**/*").on('change', browserSync.reload); // Reload on font file changes
}
// Create task
gulp.task('img', gulp.series(optimg))
gulp.task('default', gulp.series(css,minify,webfonts,browsersync,watch))
// Run "gulp" to start
