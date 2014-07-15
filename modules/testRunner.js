var log = require('xqnode-logger'),
	Mocha = require('mocha'),
	path = require('path'),
	spawn = require('child_process').spawn,
	extend = require('node.extend'),
	Istanbul = require('istanbul');

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
		log.dev('Run new test: ', conf);
		var isCodeCoverageEnabled = this.coffeeBreak.codeCoverage;

		if (isCodeCoverageEnabled) {
			this.coffeeBreak.socket.on('cov-report', function(covObj) {
				console.log('Got covReport');
				console.log(covObj);
				var outDir = path.join(conf.tmpDir, 'coverage/html-cov');

				var Report = Istanbul.Report,
					report = Report.create('html', {
						dir: outDir
					}),
					collector = new Istanbul.Collector();

				collector.add(covObj);
				report.writeReport(collector, true);
				console.log('HTML report done', outDir);

				outDir = path.join(conf.tmpDir, 'coverage/json-cov');
				report = Report.create('json', {
					dir: outDir
				});

				report.writeReport(collector, true);
				console.log('JSON report done', outDir);

			});
		}

		var runTests = function() {
			if (conf.browser) {
				this.runBrowserTests(conf, afterTest);
			}
			else {
				this.runCLITests(conf, afterTest);			
			}
		}.bind(this);

		var afterTest = function(err, statusCode) {
			if (err) {
				callback(err);
				return;
			}

			this.taskRunner.runTasks('testrunner', conf, function(err, state) {
				if (err) {
					process.stdout.write('\n  \033[1;4;38;5;246mTestrunner task failed! Skipping test run\033[m\n\n');
					callback(err);
					return;
				}
				callback(null, statusCode);
			}.bind(this));
		}.bind(this);

		// console.log('Task runner', this.taskRunner);
		this.taskRunner.runTasks('preprocessor', conf, function(err, state) {
			if (err) {
				process.stdout.write('\n  \033[1;4;38;5;246mPreprocessor task failed! Skipping test run\033[m\n\n');
				callback(err);
				return;
			}

			if (isCodeCoverageEnabled) {
				this.taskRunner.runTasks('codecoverage', conf, function(err, state) {
					if (err) {
						process.stdout.write('\n  \033[1;4;38;5;246mPreprocessor task failed! Skipping test run\033[m\n\n');
						callback(err);
						return;
					}

					runTests();
				});
			}
			else {
				runTests();
			}
		}.bind(this));
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
		files.forEach(function(file) {
			log.dev('Add file to mocha:' + path.join(conf.cwd, file));
			this.mocha.addFile(path.join(conf.cwd, file));
		}.bind(this));

		var command = path.join(__dirname, '../node_modules/.bin/mocha');
		
		var args = [
			'-R',
			'list',
			'--colors',
			'-r',
			'coffeebreak-expect-bundle'
		];

		if (conf.require) {
			if (!Array.isArray(conf.require)) {
				conf.require = conf.require.split(/\s+/);
			}

			conf.require.forEach(function(mod) {
				args.push('-r', mod);
			});
		}

		args = args.concat(conf.tests);

		var options = {
			cwd: conf.cwd,
			env: extend(process.env, {
				'NODE_ENV': 'test'
			})
		};

		var child = spawn(command, args, options);
		child.stdout.on('data', function (data) {
			process.stdout.write(data);
		});

		child.stderr.on('data', function (data) {
			process.stdout.write(data);
		});

		child.on('close', function (code) {
			if (code) {
				console.log('Child process exited with code ' + code);
			}

			var statusCode = code === 0 ? true : false;
			callback(null, statusCode);
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

		// console.log('Run with command:', command, args);
		var child = spawn(command, args);
		child.stdout.on('data', function (data) {
			process.stdout.write(data);
		});

		child.stderr.on('data', function (data) {
			// console.log('stderr: ' + data);
		});

		child.on('close', function (code) {
			// console.log('child process exited with code ' + code);
			statusCode = code === 0 ? true : false;
			callback(null, statusCode);
		});
	};

	return TestRunner;
}();
