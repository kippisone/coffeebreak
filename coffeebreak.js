
module.exports = function() {
	'use strict';

	var log = require('xqnode-logger'),
	coffeeBreak = require('./modules/coffeeBreak'),
	Socket = require('./modules/socket'),
	ExpressServer = require('./modules/expressServer');

	var coffeeBreakServer = {

	};
	
	coffeeBreakServer.start = function(command, options) {
		coffeeBreak.port = options.port || 3005;
		coffeeBreak.onlyProject = options.project || null;
		coffeeBreak.diff = options.diff || null;

		if (command === 'server') {
			this.expressServer = new ExpressServer();
			this.expressServer.start();

			this.coffeeBreak = coffeeBreak;
			this.socket = new Socket();
			this.socket.start();
			coffeeBreak.codeCoverage = options.coverage;
			coffeeBreak.scanProject(function(err, conf) {
				log.sys('Server started successful');
			});

			process.on('SIGINT', function() {
				this.expressServer.stop();
				this.socket.stop();
				process.exit();
			}.bind(this));
		}
		else if(command === 'ci') {
			this.expressServer = new ExpressServer();
			this.expressServer.start();

			this.socket = new Socket();
			this.socket.start();
			this.coffeeBreak = coffeeBreak;
			coffeeBreak.codeCoverage = options.coverage;
			coffeeBreak.scanProject(function(err, conf) {
				coffeeBreak.runTests(function(err, status) {
					this.expressServer.stop();

					var exitCode = err ? 1 : status ? 0 : 1;
					process.exit(exitCode);
				}.bind(this));
			}.bind(this));

			this.socket.stop();
		}
		else if (command === 'default') {
			this.expressServer = new ExpressServer();
			this.expressServer.start();

			this.socket = new Socket();
			this.socket.start();
			this.coffeeBreak = coffeeBreak;
			coffeeBreak.start();

			process.on('SIGINT', function() {
				this.socket.stop();
				this.expressServer.stop();
				process.exit();
			}.bind(this));
		}
		else {
			coffeeBreak.printStatus();
		}
	};

	return coffeeBreakServer;

}();