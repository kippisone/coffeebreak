var log = require('xqnode-logger'),
	Mocha = require('mocha'),
	glob = require('glob'),
	path = require('path');

module.exports = function() {
	"use strict";
	var TestRunner = function() {
		this.mocha = new Mocha({
			ui: 'bdd',
    		reporter: 'list'
    	});
	};

	/**
	 * Runs a test
	 *
	 * @method run
	 * @param {Object} conf Project configuration
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.run = function(projectConf, callback) {
		log.dev('Run tests with conf:', projectConf);
		for (var key in projectConf) {
			var conf = projectConf[key];

			if (conf.browser) {
				this.runBrowserTests(conf);
			}
			else {
				this.runCLITests(conf);			
			}
		}
		
		log.dev('Run mocha', projectConf);
		this.mocha.run(function(failures) {
			//process.exit(failures);
		});
	};

	/**
	 * Run a CLI test using mocha
	 *
	 * @method runCLITests
	 * @param {Object} conf Project configuration
	 */
	TestRunner.prototype.runCLITests = function(conf) {
		var files = glob.sync(conf.tests, {
			cwd: conf.cwd
		});

		log.dev('Files in ' + conf.cwd, files);
		var counter = 0;
		files.forEach(function(file) {
			log.dev('Add file to mocha:' + path.join(conf.cwd, file));
			this.mocha.addFile(path.join(conf.cwd, file));
		}.bind(this));
	};

	/**
	 * Run a browser test using Phantomjs
	 *
	 * @method runBrowserTests
	 * @param {Object} conf Project configuration
	 */
	TestRunner.prototype.runBrowserTests = function(conf) {
		//TODO implement method
	};

	return TestRunner;
}();
