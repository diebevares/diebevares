"use strict";
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.prod');

// basically remove the UglifyJsPlugin to prevent minification in development time.
let plugins = webpackConfig.plugins;
let uglifyPlugin = plugins.filter(x => x instanceof webpack.optimize.UglifyJsPlugin);

if(uglifyPlugin.length === 1) {
	let idx = plugins.indexOf(uglifyPlugin[0]);
	plugins.splice(idx, 1);
}

module.exports = webpackConfig;