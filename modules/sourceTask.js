
module.exports = function() {
	'use strict';

var coffeeBreak = require('../coffeebreak');

	var SourceTask = function() {

	};

	/**
	 * Add a js file to SpecRunner.html
	 * 
	 * @public
	 * @param {String} project Project name
	 * @param {String} file Filename in SpecRunner.html
	 * @param {String} path Path to file (Relative to your module)
	 */
	SourceTask.prototype.addScript = function(conf, file, path) {
		var coffeeBreak = require('../coffeebreak');
		console.log('Add file:', file, path);
		console.log('App:', coffeeBreak.app);
		console.log('Self:', this);

		coffeeBreak.app.get(file, function(req, res) {
			res.sendfile(path);
		});

		if (!conf.jsfiles) {
			conf.jsfiles = [];
		}

		if (conf.jsfiles.indexOf(file) === -1) {
			conf.jsfiles.push(file);
		}
	};

	return SourceTask;
}();