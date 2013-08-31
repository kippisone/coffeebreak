var log = require('xqnode-logger'),
	CoffeeBreak = require('./lib/coffeeBreak');

module.exports = function() {
	"use strict";
	
	var coffebreak = new CoffeeBreak();
	coffebreak.runTests();
};