/*global Socket:false, mochaPhantomJS:false, mocha:false */
var MochaRunner = (function() {

	var MochaRunner = function() {
		this.socket = new Socket();

	};

	MochaRunner.prototype.init = function() {
		this.runner = window.mochaPhantomJS ? mochaPhantomJS.run() : mocha.run();

		this.socket.emit('test.start');
		console.log('Runner obj:', this.runner);
		this.runner.on('end', function(test) {
			console.log('Result:', this.getTests(this.runner.suite));

			this.socket.emit('test.result', {
				duration: this.runner.stats.duration,
				failures: this.runner.stats.failures,
				passes: this.runner.stats.passes,
				pending: this.runner.stats.pending,
				tests: this.getTests(this.runner.suite)
			});
		}.bind(this));
	};
	
	/**
	 * Get all mocha tests
	 * @return {Object} Returns a object of all tests
	 */
	MochaRunner.prototype.getTests = function(obj) {
		var tests = obj.tests.map(function(test) {
			return {
				duration: test.duration,
				pending: test.pending,
				speed: test.speed,
				state: test.state,
				timedOut: test.timedOut,
				title: test.title,
				type: test.type,
			};
		});

		var suites = obj.suites.map(function(suite) {
			return this.getTests(suite);
		}.bind(this));

		return {
			tests: tests,
			suites: suites,
			title: obj.title
		};
	};

	return MochaRunner;
})();