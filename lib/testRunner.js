var log = require('xqnode-logger'),
	exec = require('child_process').exec,
	child;

module.exports = function() {
	"use strict";
	var TestRunner = function() {

	};

	/**
	 * Runs a test
	 *
	 * @method run
	 * @param {Object} conf Project configuration
	 * @param {Function} callback Callback function
	 */
	TestRunner.prototype.run = function(conf, callback) {
		log.dev('Run test witch config:', conf);
		child = exec('mocha --version', {

		}, function(err, stdout, stderr) {
			if (err) {
				log.error('Testrun failed!', err);
				return;
			}
			process.stdout.write(stdout);
			process.stderr.write(stderr);

			callback(err, {});
		});
	};

	return TestRunner;
}();
