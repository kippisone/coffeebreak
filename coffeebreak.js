module.exports = function() {
	'use strict';

	var CoffeeBreak = require('./modules/coffeeBreak');
	var coffeeBreak = new CoffeeBreak();

	return coffeeBreak;

}();