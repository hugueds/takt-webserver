const gulp = require('gulp');
const bs = require('browser-sync').create();


gulp.task('reload', function() {
    console.log('Initiating Gulp Browser Sync...');
    bs.init({
        proxy: '10.8.66.81',
        open: false
    })
    gulp.watch('./public/**/*.js').on('change', bs.reload);
});

gulp.task('default', ['reload']);