var log = require('xqnode-logger'),
	coffeeBreak = require('./modules/coffeeBreak'),
	expressServer = require('./modules/expressServer');

module.exports = function(command) {
	"use strict";

	if (command === 'server') {
		var app = expressServer.start();
		app.coffeeBreak = coffeeBreak;
		coffeeBreak.scanProject(function(err, conf) {
			log.sys('Server started successful');
		});

		process.on('SIGINT', function() {
			expressServer.stop();
			process.exit();
		});
	}
	else {
		//coffeeBreak.printStatus();
		coffeeBreak.start();
	}
};