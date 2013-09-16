var log = require('xqnode-logger'),
	CoffeeBreak = require('./modules/coffeeBreak'),
	expressServer = require('./modules/expressServer');

module.exports = function(command) {
	"use strict";

	var coffeeBreak = new CoffeeBreak();
	
	if (command === 'server') {
		expressServer.start();
		expressServer.app.coffeeBreak = coffeeBreak;
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