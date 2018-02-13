const gulp = require('gulp');
const util = require('gulp-util');
const filter = require("gulp-filter");
const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;

const webpackConfigDev = require('./gulp-config/webpack.config.dev');
const webpackConfigProd = require('./gulp-config/webpack.config.prod');
const sassConfig = require('./gulp-config/sass.config');
const config = require('./gulp-config/env');


const webpackError = (err, stats, callback) => {
	if(err)
		throw new util.PluginError('webpack', err);

	if(stats.compilation.errors.toString() != '')
		util.log("[webpack]", stats.compilation.errors.toString());

	if(stats.compilation.warnings.toString() != '')
		util.log("[webpack]", stats.compilation.warnings.toString());
};

/* 
==========================================================
Task Prod
==========================================================
*/
gulp.task('build-css', () => {
	return sassConfig('compressed');
});

gulp.task('webpack', (callback) => {
	webpack(webpackConfigProd, (err, stats) => {
		webpackError(err, stats);
		callback();
	});
});

/* 
==========================================================
Task Dev
==========================================================
*/
gulp.task('build-css:dev', () => {
	return sassConfig('compact')
			.pipe(filter( '**/*.css' ))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('webpack:dev', (callback) => {
	webpack(webpackConfigDev, (err, stats) => {
		webpackError(err, stats);
		callback();
	});
});

gulp.task('browser-sync', function(){
	// can pass in your local port here (i.e. gulp watch --sync 80)
	const defaultPort = (argv.sync != undefined) ? argv.sync : 8000;
	browserSync.init({
		proxy: 'localhost:' + defaultPort,
		open: false
	});
});

/* 
==========================================================
Task
==========================================================
*/

gulp.task('copy-fonts', () => {
	gulp.src([`${config.sourcePath}fonts/webfonts/**/*`])
		.pipe(gulp.dest(`${config.outputPath}fonts/`));
});

gulp.task('watch', ['build-css:dev', 'webpack:dev', 'copy-fonts', 'browser-sync'], () => {
	gulp.watch(
		[
			`${config.sourcePath}css/**/*.{scss,css}`,
			`${config.sourcePath}fonts/**/*.{scss,css}`
		],
		['build-css:dev']
	);
	
	gulp.watch(
		[`${config.sourcePath}js/**/*`],
		['webpack:dev']
	);
});

gulp.task('build', ['build-css', 'webpack', 'copy-fonts'], () => {});