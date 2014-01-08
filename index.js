var program = require('commander'),
	log = require('xqnode-logger'),
	CoffeeBreak = require('./modules/coffeeBreak'),
	expressServer = require('./modules/expressServer');

module.exports = function(command, options) {
	"use strict";

	var app,
		coffeeBreak = new CoffeeBreak(options);

	if (command === 'server') {
		app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.codeCoverage = program.coverage;
		coffeeBreak.scanProject(function(err, conf) {
			log.sys('Server started successful');
		});

		process.on('SIGINT', function() {
			expressServer.stop();
			process.exit();
		});
	}
	else if(command === 'ci') {
		app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.codeCoverage = program.coverage;
		coffeeBreak.scanProject(function(err, conf) {
			coffeeBreak.runTests(function(err, status) {
				// console.log('ERR:', err);
				// console.log('STATE:', status);
				expressServer.stop();

				var exitCode = err ? 1 : status ? 0 : 1;
				process.exit(exitCode);
			});
		});
	}
	else if (command === 'default') {
		//coffeeBreak.printStatus();
		app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.start();
	}
	else {
		coffeeBreak.printStatus();
	}
};
