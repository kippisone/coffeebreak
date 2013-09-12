var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json'),
	TestRunner = require('./testRunner'),
	EventEmitter = require('events').EventEmitter,
	extend = require('node.extend'),
	log = require('xqnode-logger'),
	fs = require('fs');

module.exports = function() {
	// "use strict";

	var CoffeeBreak = function() {

		this.testRunner = new TestRunner();
	};

	extend(CoffeeBreak.prototype, EventEmitter.prototype);

	/**
	 * Start coffeebreak
	 *
	 * @method start
	 */
	CoffeeBreak.prototype.start = function() {
		this.scanProject(function() {
			this.wachEnabled = true;
			if (this.wachEnabled) {
				process.stdin.resume();
				this.watch();
				this.on('file.changed', function(file) {
					this.runTests();
				}.bind(this));

				this.on('stop', function() {
					process.stdin.pause();
				});
			}

			this.runTests();
		}.bind(this));

	};

	CoffeeBreak.prototype.runTests = function() {
		this.testRunner.run(this.projects, function(err, result) {

		});
	};

	/**
	 * Search files and configurations
	 *
	 * @method scanProject
	 * @param {Function} callback Callback function
	 */
	CoffeeBreak.prototype.scanProject = function(callback) {
		var projectScanner = new ProjectScanner();
		projectScanner.scan(process.cwd(), function(err, projectConf) {
			this.projects = projectScanner.projects;
			this.files = projectScanner.files;

			callback(null, this);
		}.bind(this));
	};

	/**
	 * Enable file watch
	 *
	 * @method watch
	 * @param {Function} callback Callback function
	 */
	CoffeeBreak.prototype.watch = function(callback) {
		//this.projects.forEach(function(project) {
		//for (var p in this.projects) {
			// var project = this.projects[p];
			this.files.forEach(function(file) {
				log.dev('Watch file for changes: ' + file);
				fs.watchFile(file, {}, function() {
					log.info('File was changed: ' + file);
					this.emit('file.changed', file);
				}.bind(this));
			}.bind(this));
		//}
	};

	/**
	 * Print CoffeeBreak status
	 *
	 * @method printStatus
	 */
	CoffeeBreak.prototype.printStatus = function() {
		var bean = '';
		bean += '                              ____       __  __           _                    _    \n';
		bean += '   .⎼⎼⎼⎼⎼⎼⎼.                 / ___|___  / _|/ _| ___  ___| |__  _ __ ___  __ _| | __\n';
		bean += '  /    //   \\.⎼⎼⎼⎼⎼⎼.       | |   / _ \\| |_| |_ / _ \\/ _ \\ \'_ \\| \'__/ _ \\/ _` | |/ /\n';
		bean += ' /     ||  /    //   \\      | |__| (_) |  _|  _|  __/  __/ |_) | | |  __/ (_| |   < \n';
		bean += '▕      || /     ||    \\      \\____\\___/|_| |_|  \\___|\\___|_.__/|_|  \\___|\\__,_|_|\\_\\\n';
		bean += '▕      ||▕      ||    ▕            \n';
		bean += '▕      ||▕      ||    ▕      Version: ' + pkg.version + '    \n';
		bean += ' \\     ||▕      ||    ▕      Server status: down    \n';
		bean += '  \\    // \\     ||    /      Tests: 100    \n';
		bean += '   `⎻⎻⎻⎻⎻⎻´\\   //    /          \n';
		bean += '            `⎻⎻⎻⎻⎻⎻⎻´              \n';
		bean += '\n';
		bean += '01000011·01101111·01100110·01100110·01100101·01100010·01110010·01100101·01100001·01101011\n';
		bean += ' \n';
		console.log(bean);

	};

	return CoffeeBreak;
}();