var fs = require('fs'),
	path = require('path'),
	EventEmitter = require('events').EventEmitter;

var ExpressServer = require('express-server'),
	extend = require('node.extend'),
	log = require('xqnode-logger'),
	minimatch = require('minimatch');

var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json'),
	TestRunner = require('./testRunner'),
	TaskRunner = require('./taskRunner'),
	Socket = require('./socket');

module.exports = function() {
	// "use strict";

	var CoffeeBreak = function() {
		extend(this, new EventEmitter());
	};

	CoffeeBreak.prototype.init = function(command, options) {
		command = command || 'default';
		options = options || {};

		this.port = options.port || 3005;
		this.onlyProject = options.project || null;
		this.diff = options.diff || null;
		this.disableServer = options.disableServer || false;
		this.projects = {};

		var conf = {
			name: 'CoffeeBreak Server',
			port: this.port
		};

		this.taskRunner = new TaskRunner();
		this.taskRunner.coffeeBreak = this;

		this.testRunner = new TestRunner();
		this.testRunner.coffeeBreak = this;
		this.testRunner.taskRunner = this.taskRunner;


		if (command === 'server') {
			this.initServer(function() {
				this.scanProject(function(err, conf) {});
			}.bind(this));
		}
		else if(command === 'ci') {
			this.initServer(function() {
				this.startCI();
			}.bind(this));
		}
		else if(command === 'start') {
			this.start();


			process.on('SIGINT', function() {
				process.exit();
			});
		}
		else if (command === 'default') {
			this.initServer(function() {
				this.start();
			}.bind(this));
		}
		else {
			this.printStatus();
		}
	};

	/**
	 * Initialize Express and Socket server
	 *
	 * @private
	 */
	CoffeeBreak.prototype.initServer = function(callback) {
		this.expressServer = new ExpressServer({
			name: 'CoffeeBreak Server',
			baseDir: path.join(__dirname,'..'),
			port: this.port,
			logLevel: log.getLevel()
		});

		this.expressServer.start({
			disableServer: this.disableServer
		}, function() {
			this.app = this.expressServer.app;
			this.socket = new Socket();
			this.socket.start();

			this.emit('ready');
			log.sys('Server started successful');
			
			callback(this);
		}.bind(this));

		process.on('SIGINT', function() {
			this.socket.stop();
			this.expressServer.stop();
			process.exit();
		}.bind(this));
	};

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

	/**
	 * Start coffeebreak
	 *
	 * @method start
	 */
	CoffeeBreak.prototype.startCI = function() {
		this.scanProject(function(err, conf) {
			this.runTests(function(err, status) {
				this.stop();

				var exitCode = err ? 1 : status ? 0 : 1;
				process.exit(exitCode);
			}.bind(this));
		}.bind(this));
	};

	CoffeeBreak.prototype.stop = function() {
		this.socket.stop();
		this.expressServer.stop();
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
		var conf = {
			projects: []
		};

		for (var p in this.projects) {
			conf.projects.push({
				project: this.projects[p].project,
				dirName: this.projects[p].dirName,
				status: this.projects[p].status
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
		var projectScanner = new ProjectScanner(),
			dir = process.cwd();

		log.sys('\033[38;5;220mScan dir for projects ...\033[m', dir);
		var start = Date.now();
		projectScanner.scan(dir, function(err, projectConf) {
			this.projects = projectScanner.projects;
			this.files = projectScanner.files;

			log.sys('\033[38;5;220m' + Object.keys(this.projects).length + ' projects found in ' + (Date.now() - start) + 'ms!\033[m');
			
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

	return CoffeeBreak;
}();