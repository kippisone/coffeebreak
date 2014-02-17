module.exports = function() {
	"use strict";
	
	var TestMethod = function() {
		console.log('Call test method constructor');
	};

	TestMethod.prototype.sayIt = function(msg) {
		console.log('msg');
	};

	return new TestMethod();
}();