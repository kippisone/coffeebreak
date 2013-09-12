var log = require('xqnode-logger'),
	CoffeeBreak = require('./modules/coffeeBreak'),
	expressServer = require('./modules/expressServer');

module.exports = function(command) {
	"use strict";
	
	if (command === 'server') {
		expressServer.start();

		process.on('SIGINT', function() {
			expressServer.stop();
		});
	}
	else {
		var coffeebreak = new CoffeeBreak();
		// coffeebreak.printStatus();
		coffeebreak.start();
	}
};