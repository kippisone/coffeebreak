var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json'),
	TestRunner = require('./testRunner'),
	EventEmitter = require('events').EventEmitter,
	extend = require('node.extend'),
	log = require('xqnode-logger'),
	fs = require('fs'),
	path = require('path');

module.exports = function() {
	// "use strict";

	var CoffeeBreak = function() {

		this.testRunner = new TestRunner();
		this.testRunner.coffeeBreak = this;

		this.__tasks = {};
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

	CoffeeBreak.prototype.runTests = function(projectName) {
		if (projectName) {
			this.testRunner.runOne(this.projects[projectName], function(err, result) {

			});
		}
		else {
			this.testRunner.run(this.projects, function(err, result) {
				
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
			var file = path.join(project.cwd, file);
			log.dev('Watch file for changes: ' + file + ' in project:' + project.project);

			fs.watchFile(file, function() {
				log.info('File was changed: ' + file);
				this.emit('file.changed', file, project);
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
			project.files.forEach(addWatch.bind(this));
			project.tests.forEach(addWatch.bind(this));
		}
	};

	/**
	 * Register a task
	 *
	 * @method registerTask
	 * @param {String} task Task name
	 */
	CoffeeBreak.prototype.registerTask = function(task, taskFunc) {
		if (['preprocessor'].indexOf(task) === -1) {
			log.warn('Unknown task name ' + task);
			return;
		}

		if (!this.__tasks['preprocessor']) {
			this.__tasks['preprocessor'] = [];
		}

		this.__tasks['preprocessor'].push(taskName);
	};

	/**
	 * Run all registered tasks
	 *
	 * @method runTasks
	 * @param {String} task Task name
	 * @param {Object} conf Conf object
	 * @param {Function} callback Callback function
	 */
	CoffeeBreak.prototype.runTasks = function(task, conf, callback) {
		if (!this.__tasks[task]) {
			log.dev('No ' + task + ' tasks defined');
			callback(null, true);
			return;
		}

		async.applyEachSeries(this.__tasks[task], conf, log, function(err, result) {
			if (err) {
				log.warn('An error occurs in ' + task + ' task! Skipping ...', err);
				callback(err);
			}
			else {
				log.dev('All ' + task + ' tasks hav been done!', result);
				callback(null, true);
			}
		});
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

	return new CoffeeBreak();
}();