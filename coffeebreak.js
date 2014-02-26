
module.exports = function() {
	'use strict';

	var log = require('xqnode-logger'),
		ExpressServer = require('express-server');

	var coffeeBreak = require('./modules/coffeeBreak'),
		Socket = require('./modules/socket'),
		coffeeBreakApp = require('./modules/app');

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

		coffeeBreakApp.coffeeBreak = coffeeBreak;

		if (command === 'server') {
			coffeeBreakApp.expressServer = new ExpressServer(conf);
			coffeeBreakApp.expressServer.start({}, function() {
				// coffeeBreakApp.socket = new Socket();
				// coffeeBreakApp.socket.start();
				// coffeeBreakApp.coffeeBreak = coffeeBreak;
				// coffeeBreak.start();
				coffeeBreakApp.coffeeBreak = coffeeBreak;
				coffeeBreakApp.socket = new Socket();
				coffeeBreakApp.socket.start();
				coffeeBreak.codeCoverage = options.coverage;
				coffeeBreak.scanProject(function(err, conf) {
					log.sys('Server started successful');
				});
			});


			process.on('SIGINT', function() {
				coffeeBreakApp.expressServer.stop();
				coffeeBreakApp.socket.stop();
				process.exit();
			});
		}
		else if(command === 'ci') {
			coffeeBreakApp.expressServer = new ExpressServer(conf);
			coffeeBreakApp.expressServer.start();

			coffeeBreakApp.socket = new Socket();
			coffeeBreakApp.socket.start();
			coffeeBreak.codeCoverage = options.coverage;
			coffeeBreak.scanProject(function(err, conf) {
				coffeeBreak.runTests(function(err, status) {
					coffeeBreakApp.expressServer.stop();

					var exitCode = err ? 1 : status ? 0 : 1;
					process.exit(exitCode);
				});
			});

			coffeeBreakApp.socket.stop();
		}
		else if (command === 'default') {
			coffeeBreakApp.expressServer = new ExpressServer(conf);
			coffeeBreakApp.expressServer.start({}, function() {
				coffeeBreakApp.socket = new Socket();
				coffeeBreakApp.socket.start();
				coffeeBreakApp.coffeeBreak = coffeeBreak;
				coffeeBreak.start();
			});


			process.on('SIGINT', function() {
				coffeeBreakApp.socket.stop();
				coffeeBreakApp.expressServer.stop();
				process.exit();
			});
		}
		else {
			coffeeBreak.printStatus();
		}
	};

	return coffeeBreakServer;

}();