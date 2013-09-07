var log = require('xqnode-logger'),
	CoffeeBreak = require('./lib/coffeeBreak');

module.exports = function() {
	"use strict";
	
	var coffeebreak = new CoffeeBreak();
	// coffeebreak.printStatus();
	coffeebreak.runTests();
};