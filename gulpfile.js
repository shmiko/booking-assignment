var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function(){
	return gulp.src('css/**/*.css')
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minifycss())
		.pipe(rename({
			suffix : '.min'
		}))
		.pipe(gulp.dest('css/'));
});

gulp.task('scripts', function(){
	return gulp.src('js/**/*.js')
		.pipe(rename({
			suffix : '.min'
		}))
		.pipe(uglify({outSourceMap: true}))
		.pipe(gulp.dest('/js'));
});