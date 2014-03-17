
module.exports = function() {
	'use strict';

	var log = require('xqnode-logger'),
		ExpressServer = require('express-server');

	var coffeeBreak = require('./modules/coffeeBreak'),
		Socket = require('./modules/socket');

	var coffeeBreakServer = {

	};
	
	coffeeBreakServer.start = function(command, options) {
		coffeeBreak.port = options.port || 3005;
		coffeeBreak.onlyProject = options.project || null;
		coffeeBreak.diff = options.diff || null;

		var conf = {
			name: 'CoffeeBreak Server',
			baseDir: __dirname,
			port: coffeeBreak.port
		};

		if (command === 'server') {
			coffeeBreak.expressServer = new ExpressServer(conf);
			coffeeBreak.app = coffeeBreak.expressServer.app;
			coffeeBreak.expressServer.start({}, function() {
				// coffeeBreakApp.socket = new Socket();
				// coffeeBreakApp.socket.start();
				// coffeeBreakApp.coffeeBreak = coffeeBreak;
				// coffeeBreak.start();
				coffeeBreak.coffeeBreak = coffeeBreak;
				coffeeBreak.socket = new Socket();
				coffeeBreak.socket.start();
				coffeeBreak.codeCoverage = options.coverage;
				coffeeBreak.scanProject(function(err, conf) {
					log.sys('Server started successful');
				});
			});


			process.on('SIGINT', function() {
				coffeeBreak.expressServer.stop();
				coffeeBreak.socket.stop();
				process.exit();
			});
		}
		else if(command === 'ci') {
			coffeeBreak.expressServer = new ExpressServer(conf);
			coffeeBreak.expressServer.start();

			coffeeBreak.socket = new Socket();
			coffeeBreak.socket.start();
			coffeeBreak.codeCoverage = options.coverage;
			coffeeBreak.scanProject(function(err, conf) {
				coffeeBreak.runTests(function(err, status) {
					coffeeBreak.expressServer.stop();

					var exitCode = err ? 1 : status ? 0 : 1;
					process.exit(exitCode);
				});
			});

			coffeeBreak.socket.stop();
		}
		else if(command === 'start') {
			coffeeBreak.coffeeBreak = coffeeBreak;
			coffeeBreak.start();


			process.on('SIGINT', function() {
				process.exit();
			});
		}
		else if (command === 'default') {
			coffeeBreak.expressServer = new ExpressServer(conf);
			coffeeBreak.expressServer.start({}, function() {
				coffeeBreak.socket = new Socket();
				coffeeBreak.socket.start();
				coffeeBreak.coffeeBreak = coffeeBreak;
				coffeeBreak.start();
			});


			process.on('SIGINT', function() {
				coffeeBreak.socket.stop();
				coffeeBreak.expressServer.stop();
				process.exit();
			});
		}
		else {
			coffeeBreak.printStatus();
		}
	};

	return coffeeBreakServer;

}();