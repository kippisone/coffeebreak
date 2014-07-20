var fs = require('fs'),
	path = require('path');

var log = require('xqnode-logger'),
	async = require('async');

module.exports = function() {
	"use strict";

	var SourceTask = require('./sourceTask');

	var TaskRunner = function() {
		this.__tasks = {};
		this.baseDir = path.join(__dirname, '..');
	};

	/**
	 * Load all registered tasks
	 *
	 * @method loadTasks
	 */
	TaskRunner.prototype.loadTasks = function() {
		var cbModules = {};

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
			require(cbModules[m])(this);
		}.bind(this));
	};

	/**
	 * Register a task
	 *
	 * @method registerTask
	 * @param {String} task Task name
	 */
	TaskRunner.prototype.registerTask = function(task, taskFunc) {
		if (['preprocessor', 'testrunner', 'source',   'prepare', 'coverage', 'test', 'report', 'clean'].indexOf(task) === -1) {
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
	 * @param {Function} callback Callback function
	 */
	TaskRunner.prototype.runTasks = function(task, conf, callback) {
		if (!this.__tasks[task]) {
			log.dev('No ' + task + ' tasks defined');
			callback(null, true);
			return;
		}

        process.chdir(conf.cwd);
		async.applyEachSeries(this.__tasks[task], conf, log, function(err, result) {
			if (err) {
				log.warn('An error occurs in ' + task + ' task! Skipping ...', err);
				callback(err);
			}
			else {
				log.dev('All ' + task + ' tasks have been done!', result);
				callback(null, true);
			}
		});
	};

	return TaskRunner;
}();