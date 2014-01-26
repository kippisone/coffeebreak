var log = require('xqnode-logger'),
	coffeeBreak = require('./modules/coffeeBreak'),
	Socket = require('./modules/socket'),
	expressServer = require('./modules/expressServer');

module.exports = function(command, options) {
	"use strict";

	var app;

	if (command === 'server') {
		app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
		app.socket = new Socket();
		app.socket.start();
		coffeeBreak.codeCoverage = options.coverage;
		coffeeBreak.scanProject(function(err, conf) {
			log.sys('Server started successful');
		});

		process.on('SIGINT', function() {
			expressServer.stop();
			app.socket.stop();
			process.exit();
		});
	}
	else if(command === 'ci') {
		app = expressServer.start();
		app.socket = new Socket();
		app.socket.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.codeCoverage = options.coverage;
		coffeeBreak.scanProject(function(err, conf) {
			coffeeBreak.runTests(function(err, status) {
				// console.log('ERR:', err);
				// console.log('STATE:', status);
				expressServer.stop();

				var exitCode = err ? 1 : status ? 0 : 1;
				process.exit(exitCode);
			});
		});

		app.socket.stop();
	}
	else if (command === 'default') {
		//coffeeBreak.printStatus();
		app = expressServer.start();
		app.socket = new Socket();
		app.socket.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.start();

		process.on('SIGINT', function() {
			app.socket.stop();
			expressServer.stop();
			process.exit();
		});
	}
	else {
		coffeeBreak.printStatus();
	}
};
