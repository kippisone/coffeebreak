var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json'),
	TestRunner = require('./testRunner'),
	TaskRunner = require('./taskRunner'),
	EventEmitter = require('events').EventEmitter,
	extend = require('node.extend'),
	log = require('xqnode-logger'),
	fs = require('fs'),
	path = require('path'),
	minimatch = require('minimatch');

module.exports = function() {
	// "use strict";

	var CoffeeBreak = function() {

		this.taskRunner = new TaskRunner();
		this.taskRunner.coffeeBreak = this;

		this.testRunner = new TestRunner();
		this.testRunner.coffeeBreak = this;
		this.testRunner.taskRunner = this.taskRunner;
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

	CoffeeBreak.prototype.runTests = function(projectName, callback) {
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
	CoffeeBreak.prototype.getPublicConf = function() {
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

			fs.watchFile(file, function() {
				log.sys('File was changed: ' + file + ' of project ' + projectName);
				this.emit('file.changed', file, projectName);
			}.bind(this));

			// var watcher = fs.watch(project.cwd, function (event, filename) {
			// 	if (filename) {
			// 		console.log('  Change of type ' + event + ' on file: ' + filename);
			// 	} else {
			// 		console.log('filename not provided');
			// 	}
			// });

			// watcher.on('change', function() {
			// 	log.dev('Got watcher.change', arguments);
			// });
		};
		//this.projects.forEach(function(project) {
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
	CoffeeBreak.prototype.printStatus = function() {
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

	return new CoffeeBreak();
}();