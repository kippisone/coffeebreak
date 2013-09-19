var log = require('xqnode-logger'),
	Mocha = require('mocha'),
	glob = require('glob'),
	path = require('path'),
	spawn = require('child_process').spawn,
	coffeeBreak = require('./coffeeBreak');

module.exports = function() {
	// "use strict";
	var TestRunner = function() {
		this.mocha = new Mocha({
			ui: 'bdd',
    		reporter: 'list'
    	});

    	this.queue = [];
    	this.isRunning = false;
	};

	/**
	 * Runs a test
	 *
	 * @method run
	 * @param {Object} conf Project configuration
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.run = function(projectConf, callback) {
		var runNext = function() {
			var next = this.queue.shift();
			if (next) {
				this.runOne(next, runNext);
			}
			else {
				callback();
			}
		}.bind(this);

		log.dev('Run tests with conf:', projectConf);
		for (var key in projectConf) {
			var conf = projectConf[key];
			this.queue.push(conf);
		}

		runNext();
	};

	/**
	 * Runs  a test
	 *
	 * @param {Object} conf Configuration of a test
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.runOne = function(conf, callback) {
		log.dev('Run new test: ', conf);

		var runTests = function() {
			if (conf.browser) {
				this.runBrowserTests(conf, callback);
			}
			else {
				this.runCLITests(conf, callback);			
			}
		}.bind(this);

		this.coffeeBreak.runTasks('preprocessor', conf, function(err, state) {
			if (err) {
				process.stdout.write('\n  \033[1;4;38;5;246mPreprocessor task failed! Skipping test run\033[m\n\n');
				return;
			}

			runTests();
		});
	};

	/**
	 * Run a CLI test using mocha
	 *
	 * @method runCLITests
	 * @param {Object} conf Project configuration
	 */
	TestRunner.prototype.runCLITests = function(conf, callback) {
		process.stdout.write('\n  \033[1;4;38;5;246mRun node.js testst of project ' + conf.project + ' using Mocha\033[m\n\n');
		var files = conf.tests;

		log.dev('Files in ' + conf.cwd, files);
		var counter = 0;
		files.forEach(function(file) {
			log.dev('Add file to mocha:' + path.join(conf.cwd, file));
			this.mocha.addFile(path.join(conf.cwd, file));
		}.bind(this));

		this.mocha.run(function(failures) {
			callback(failures);
		});
	};

	/**
	 * Run a browser test using Phantomjs
	 *
	 * @method runBrowserTests
	 * @param {Object} conf Project configuration
	 */
	TestRunner.prototype.runBrowserTests = function(conf, callback) {
		process.stdout.write('\n  \033[1;4;38;5;246mRun browser tests of project ' + conf.project + ' using PhantomJS\033[m\n\n');

		//TODO call hooks

		var command = path.join(__dirname, '../node_modules/.bin/mocha-phantomjs');
		var args = [
			'http://localhost:3005/projects/' + conf.project + '/SpecRunner.html'
		];

		console.log('Run with command:', command, args);
		var child = spawn(command, args);
		child.stdout.on('data', function (data) {
		  process.stdout.write(data);
		});

		child.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		child.on('close', function (code) {
		  console.log('child process exited with code ' + code);
		  callback(null);
		});
	};

	/**
	 * Run a preprocessor
	 *
	 * @method runPreprocessor
	 * @param {Object} conf Project configuration object
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.runPreprocessor = function(conf, callback) {
		log.dev('Run preprocessor', conf.preprocessor);
		
	};

	return TestRunner;
}();
