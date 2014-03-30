module.exports = function(app, callback) {
	'use strict';

	var path = require('path');

	var express = require('express'),
		log = require('xqnode-logger');

	// app.use(express.logger('dev'));
	app.engine('.hbs', require('hbs').__express);
	app.set('view engine', 'hbs');
	app.set('views', path.join(__dirname, '../views'));
	app.baseDir = __dirname;

	/**
	 * Static files
	 */
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(log.__express);
	
	callback();
};