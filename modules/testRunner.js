var log = require('xqnode-logger'),
	async = require('async'),
	extend = require('node.extend');

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
		if (this.coffeeBreak.__projectConfig === projectConf) {
			log.warn('Config isn\'t a copy in TestRunner.run');
		}

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

		conf = extend({}, conf);
		if (this.coffeeBreak.__projectConfig[conf.project] === conf) {
			log.warn('Config isn\'t a copy in TestRunner.runOne');
		}


		log.dev('Run new test: ', conf);
		var isCodeCoverageEnabled = this.coffeeBreak.codeCoverage;

		var queue = [];
		queue.push(function(cb) {
			log.dev('Run prepare task', conf);
			self.taskRunner.runTasks('prepare', conf, cb);
		});
		
		if (isCodeCoverageEnabled) {
			queue.push(function(cb) {
			log.dev('Run coverage task', conf);
				self.taskRunner.runTasks('coverage', conf, cb);
			});
		}
		
		queue.push(function(cb) {
			log.dev('Run test task', conf);
			self.taskRunner.runTasks('test', conf, cb);
		});
		
		queue.push(function(cb) {
			log.dev('Run report task', conf);
			self.taskRunner.runTasks('report', conf, cb);
		});
		
		queue.push(function(cb) {
			log.dev('Run clean task', conf);
			self.taskRunner.runTasks('clean', conf, cb);
		});

		async.series(queue, function(err, result) {
			log.dev('All tasks completed', result);
			callback(err, err ? false : true);
		});
	};

	return TestRunner;
}();
