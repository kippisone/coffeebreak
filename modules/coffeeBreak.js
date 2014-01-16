var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json'),
	TestRunner = require('./testRunner'),
	TaskRunner = require('./taskRunner'),
	EventEmitter = require('events').EventEmitter,
	extend = require('node.extend'),
	log = require('xqnode-logger'),
	fs = require('fs'),
	path = require('path'),
	minimatch = require('minimatch'),
	Socket = require('./socket');

module.exports = function() {
	// "use strict";

	var coffeeBreak = {

	};
	
	coffeeBreak.taskRunner = new TaskRunner();
	coffeeBreak.taskRunner.coffeeBreak = coffeeBreak;

	coffeeBreak.testRunner = new TestRunner();
	coffeeBreak.testRunner.coffeeBreak = coffeeBreak;
	coffeeBreak.testRunner.taskRunner = coffeeBreak.taskRunner;

	coffeeBreak.socket = new Socket();

	extend(coffeeBreak, EventEmitter.prototype);

	/**
	 * Start coffeebreak
	 *
	 * @method start
	 */
	coffeeBreak.start = function() {
		this.scanProject(function() {
			this.wachEnabled = true;
			if (this.wachEnabled) {
				process.stdin.resume();
				this.watch();
				this.on('file.changed', function(file, projectName) {
					this.runTests(projectName);
				}.bind(this));

				this.on('stop', function() {
					process.stdin.pause();
				});
			}

			this.runTests();
		}.bind(this));

	};

	coffeeBreak.runTests = function(projectName, callback) {
		if (typeof projectName === 'function') {
			callback = projectName;
			projectName = null;
		}

		if (projectName) {
			this.testRunner.runOne(this.projects[projectName], function(err, result) {
				if (typeof callback === 'function') {
					callback(err, result);
				}
			});
		}
		else {
			this.testRunner.run(this.projects, function(err, result) {
				if (typeof callback === 'function') {
					callback(err, result);
				}
			});
		}
	};

	/**
	 * Get public CoffeBreak configuration
	 *
	 * @method getPublicConf
	 * @return {Object} Public project configuration
	 */
	coffeeBreak.getPublicConf = function() {
		var conf = [];

		for (var p in this.projects) {
			conf.push({
				project: this.projects[p].project,
				dirName: this.projects[p].dirName
			});
		}

		return conf;
	};

	/**
	 * Search files and configurations
	 *
	 * @method scanProject
	 * @param {Function} callback Callback function
	 */
	coffeeBreak.scanProject = function(callback) {
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
	coffeeBreak.watch = function(callback) {
		var addWatch = function(file) {
			var projectName = project.project;

			if (minimatch(file, project.watchIgnore)) {
				log.dev('File is in watchIgnore: ' + file + ' in project:' + project.project);
				return false;
			}

			if (project.watch.indexOf(file) !== -1) {
				log.dev('File has allready a watcher: ' + file + ' in project:' + project.project);
				return;
			}
			
			project.watch.push(file);
			file = path.join(project.cwd, file);
			log.dev('Watch file for changes: ' + file + ' in project:' + project.project);

			var options = {
				interval: 250
			};

			fs.watchFile(file, options, function(curr, prev) {
				if (curr.mtime > prev.mtime) {
					log.sys('File was changed: ' + file + ' of project ' + projectName);
					this.emit('file.changed', file, projectName);
				}
			}.bind(this));
		};
		
		for (var p in this.projects) {
			var project = this.projects[p];
			var watchFiles = project.watch || project.files;
			project.watch = [];
			watchFiles.forEach(addWatch.bind(this));
			project.tests.forEach(addWatch.bind(this));
		}
	};

	/**
	 * Print CoffeeBreak status
	 *
	 * @method printStatus
	 */
	coffeeBreak.printStatus = function() {
		var bean = '';
		bean += '                              ____       __  __           _                    _    \n';
		bean += '   .⎼⎼⎼⎼⎼⎼⎼.                 / ___|___  / _|/ _| ___  ___| |__  _ __ ___  __ _| | __\n';
		bean += '  /    //   \\.⎼⎼⎼⎼⎼⎼.       | |   / _ \\| |_| |_ / _ \\/ _ \\ \'_ \\| \'__/ _ \\/ _` | |/ /\n';
		bean += ' /     ||  /    //   \\      | |__| (_) |  _|  _|  __/  __/ |_) | | |  __/ (_| |   < \n';
		bean += '▕      || /     ||    \\      \\____\\___/|_| |_|  \\___|\\___|_.__/|_|  \\___|\\__,_|_|\\_\\\n';
		bean += '▕      ||▕      ||    ▕            \n';
		bean += '▕      ||▕      ||    ▕      Version: ' + pkg.version + '    \n';
		bean += ' \\     ||▕      ||    ▕      \n';
		bean += '  \\    // \\     ||    /      \n';
		bean += '   `⎻⎻⎻⎻⎻⎻´\\   //    /          \n';
		bean += '            `⎻⎻⎻⎻⎻⎻⎻´              \n';
		bean += '\n';
		bean += '01000011·01101111·01100110·01100110·01100101·01100010·01110010·01100101·01100001·01101011\n';
		bean += ' \n';
		console.log(bean);

	};

	return coffeeBreak;
}();