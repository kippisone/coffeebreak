var log = require('xqnode-logger'),
	async = require('async');

module.exports = function() {
	"use strict";

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
		require('coffeebreak-component-build')(this);
	};

	/**
	 * Register a task
	 *
	 * @method registerTask
	 * @param {String} task Task name
	 */
	TaskRunner.prototype.registerTask = function(task, taskFunc) {
		if (['preprocessor', 'codecoverage', 'testrunner'].indexOf(task) === -1) {
			log.warn('Unknown task name ' + task);
			return;
		}

		if (!this.__tasks[task]) {
			this.__tasks[task] = [];
		}

		this.__tasks[task].push(taskFunc);
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