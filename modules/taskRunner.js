var fs = require('fs'),
	path = require('path');

var log = require('xqnode-logger'),
	async = require('async');

module.exports = function() {
	"use strict";

	var SourceTask = function() {

	};

	SourceTask.insertJSFile = function(file) {
		console.log('Add file:', file);
	};

	SourceTask.insertJSCode = function(code) {
		console.log('Add code:', code);
	};

	var TaskRunner = function() {
		this.__tasks = {};
		this.loadTasks();
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
			var allModules = fs.readdirSync(moduleDir);
			allModules.forEach(function(moduleName) {
				if (/^coffeebreak-/.test(moduleName)) {
					cbModules[moduleName] = path.join(moduleDir, moduleName);
				}
			});
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
		if (['preprocessor', 'codecoverage', 'testrunner', 'source'].indexOf(task) === -1) {
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

	return TaskRunner;
}();