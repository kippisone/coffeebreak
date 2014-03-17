
module.exports = function() {
	'use strict';

	var CoffeeBreak = require('./modules/coffeeBreak');
	var coffeeBreakServer = new CoffeeBreak();

	return coffeeBreakServer;

}();