var ProjectScanner = require('./projectScanner');

module.exports = function() {
	"use strict";

	var CoffeeBreak = function() {

	};

	CoffeeBreak.prototype.runTests = function() {
		var projectScanner = new ProjectScanner();
		projectScanner.scan(process.cwd(), function() {
			
		});
	};

	return CoffeeBreak;
}();