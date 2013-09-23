var program = require('commander'),
	log = require('xqnode-logger'),
	coffeeBreak = require('./modules/coffeeBreak'),
	expressServer = require('./modules/expressServer'),
	pkg = require('./package.json');

module.exports = function() {
	"use strict";

	program
		.version(pkg.version)
		.usage('[command] [options]')
		.option('-d', '--dev', 'Run in debug mode')
		.option('-p', '--port', 'Set server port', '3005')
		.command('server')
		.description('Start the server without running tests')
		.command('ci')
		.description('Continious integration mode. Start server, run all tests and shut the server down');

	program.on('--help', function() {
		coffeeBreak.printStatus();
	});

	program.parse(process.argv);

	//Set debug mode
	if (program.dev || process.argv[1] === 'scoffeebreak-dev') {
		log.setLevel('debug');
	}
	else {
		log.setLevel('sys');
	}

	var args = process.argv.slice(2);
	var command = args[0] || null,
		app;

	if (command === 'server') {
		app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
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
		coffeeBreak.scanProject(function(err, conf) {
			coffeeBreak.runTests(function(err, status) {
				console.log('ERR:', err);
				console.log('STATE:', status);
				expressServer.stop();

				var exitCode = err ? 1 : 0;
				process.exit(exitCode);
			});
		});
	}
	else {
		//coffeeBreak.printStatus();
		coffeeBreak.start();
	}
};
