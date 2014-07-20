var log = require('xqnode-logger'),
	path = require('path'),
	Istanbul = require('istanbul'),
	async = require('async');

module.exports = function() {
	// "use strict";
	var TestRunner = function() {
		this.queue = [];
		this.isRunning = false;
	};

	/**
	 * Runs all tests
	 *
	 * @method run
	 * @param {Object} conf Project configuration
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.run = function(projectConf, callback) {
		var runNext = function(err, statusCode) {
			var next = this.queue.shift();
			if (next && statusCode === true) {
				this.runOne(next, runNext);
			}
			else {
				callback(err, statusCode);
			}
		}.bind(this);

		log.dev('Run tests with conf:', projectConf);
		for (var key in projectConf) {
			var conf = projectConf[key];
			this.queue.push(conf);
		}

		runNext(null, true);
	};

	/**
	 * Runs  a test
	 *
	 * @param {Object} conf Configuration of a test
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.runOne = function(conf, callback) {
		var self = this;

		log.dev('Run new test: ', conf);
		var isCodeCoverageEnabled = this.coffeeBreak.codeCoverage;

		var queue = [];
		queue.push(function(cb) {
			console.log('Run prepare task');
			self.taskRunner.runTasks('prepare', conf, cb);
		});
		
		if (isCodeCoverageEnabled) {
			queue.push(function(cb) {
			console.log('Run coverage task');
				self.taskRunner.runTasks('coverage', conf, cb);
			});
		}
		
		queue.push(function(cb) {
			console.log('Run test task');
			self.taskRunner.runTasks('test', conf, cb);
		});
		
		queue.push(function(cb) {
			console.log('Run report task');
			self.taskRunner.runTasks('report', conf, cb);
		});
		
		queue.push(function(cb) {
			console.log('Run clean task');
			self.taskRunner.runTasks('clean', conf, cb);
		});

		async.series(queue, function(err, result) {
			console.log('DONE');
			callback(err, err ? false : true);
		});
	};

	return TestRunner;
}();
