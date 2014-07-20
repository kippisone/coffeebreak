module.exports = function() {
	"use strict";
	
	var TestMethod = function() {
		
	};

	TestMethod.prototype.sayIt = function(msg) {
		console.log('msg');
	};

	return new TestMethod();
}();