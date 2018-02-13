const gulp = require('gulp');
const sass = require('gulp-sass');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require("gulp-autoprefixer");
const config = require('./env');

const AUTOPREFIXER_BROWSERS = [
	'ie >= 8'
];

module.exports = (_output) => {
	return gulp.src([
				`${config.sourcePath}css/**/*.{scss,css}`,
				`${config.sourcePath}fonts/**/*.{scss,css}`
			])
			.pipe(sass({ outputStyle: _output }).on('error', sass.logError))
			.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
			.pipe(newer(`./tmp/styles`))
			.pipe(sourcemaps.init())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(`${config.outputPath}css/`));
};