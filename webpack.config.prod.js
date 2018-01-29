"use strict";
const webpack = require('webpack');
const BowerWebpackPlugin = require('bower-webpack-plugin');
const config = require('./env');
const fs = require('fs');

let entry = {};
let files = fs.readdirSync(`${config.sourcePath}js/pages/`);
files.forEach(function(key){
	entry[key.replace(/\.js$/, '')] = [`${__dirname}/${config.sourcePath}js/pages/${key}`];
});

module.exports = {
	entry: entry,
	devtool: 'source-map',
	
	output: {
		path: `${__dirname}/${config.outputPath}js/`,
		filename: '[name].min.js'
	},
	
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: './webpack_cache/',
					presets: ['es2015', 'stage-2'],
					plugins: ['transform-object-assign']
				}
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('common'),
		
		// This plugin minifies all the Javascript code of the final bundle
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: {
				warnings: false // Suppress uglification warnings
			}
		})
	],
	
	resolve: {
		extensions: ['.js', '.json']
	}
};