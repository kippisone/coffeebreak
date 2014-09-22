var fs = require('fs'),
	path = require('path');

var log = require('xqnode-logger'),
	async = require('async');

module.exports = function() {
	"use strict";

	var SourceTask = require('./sourceTask');

	var TaskRunner = function() {
		this.__tasks = {};
	};

	/**
	 * Load all registered tasks
	 *
	 * @method loadTasks
	 */
	TaskRunner.prototype.loadTasks = function() {
		var cbModules = {};

		this.coffeeBreak.baseDir = path.join(__dirname, '..');
		this.coffeeBreak.registerTask = this.registerTask.bind(this);

		log.sys('Load coffeebreak modules');
		
		[
			path.join(__dirname, '../node_modules'),
			path.join(process.cwd(), 'node_modules')
		].forEach(function(moduleDir) {
			log.sys('... load from ', moduleDir);
			if (fs.existsSync(moduleDir)) {
				var allModules = fs.readdirSync(moduleDir);
				allModules.forEach(function(moduleName) {
					if (/^coffeebreak-/.test(moduleName) && !/-bundle$/.test(moduleName)) {
						cbModules[moduleName] = path.join(moduleDir, moduleName);
					}
				});
			}
		});

		Object.keys(cbModules).forEach(function(m) {
			log.sys('... load coffeebreak module', m);
			require(cbModules[m])(this.coffeeBreak);
		}.bind(this));
	};

	/**
	 * Register a task
	 *
	 * @method registerTask
	 * @param {String} task Task name
	 */
	TaskRunner.prototype.registerTask = function(task, taskFunc) {
		if (['start', 'preprocessor', 'testrunner', 'source',   'prepare', 'coverage', 'test', 'report', 'clean', 'serve', 'end'].indexOf(task) === -1) {
			log.warn('Unknown task name ' + task);
			return;
		}

		if (!this.__tasks[task]) {
			this.__tasks[task] = [];
		}

		if (task === 'source') {
			this.__tasks[task].push(taskFunc.bind(new SourceTask()));
		}
		else {
			this.__tasks[task].push(taskFunc);
		}
	};

	/**
	 * Run all registered tasks
	 *
	 * @method runTasks
	 * @param {String} task Task name
	 * @param {Object} conf Conf object
	 * @param {Object} data Data object (optional)
	 * @param {Function} callback Callback function
	 */
	TaskRunner.prototype.runTasks = function(task, conf, data, callback) {
		if (arguments.length === 3) {
			callback = data;
			data = null;
		}

		if (!this.__tasks[task]) {
			log.dev('No ' + task + ' tasks defined');
			callback(null, true);
			return;
		}

        process.chdir(conf.cwd);
		
        var fn = function(err, result) {
			if (err) {
				log.warn('An error occurs in ' + task + ' task! Skipping ...', err);
				callback(err);
			}
			else {
				callback(null, true);
			}
		};

		if (arguments.length === 3) {
			async.applyEachSeries(this.__tasks[task], conf, log, fn);
		}
		else {
			async.applyEachSeries(this.__tasks[task], conf, data, log, fn);
		}
	};

	return TaskRunner;
}();