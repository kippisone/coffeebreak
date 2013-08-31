var ProjectScanner = require('./projectScanner'),
	pkg = require('../package.json');

module.exports = function() {
	// "use strict";

	var CoffeeBreak = function() {

	};

	CoffeeBreak.prototype.runTests = function() {
		var projectScanner = new ProjectScanner();
		projectScanner.scan(process.cwd(), function() {
			
		});
	};

	/**
	 * Print CoffeeBreak status
	 *
	 * @method printStatus
	 */
	CoffeeBreak.prototype.printStatus = function() {
		var bean = '';
		bean += '                              ____       __  __      _                    _       \n';
		bean += '   .⎼⎼⎼⎼⎼⎼⎼.                 / ___|___  / _|/ _| ___| |__  _ __ ___  __ _| | __   \n';
		bean += '  /    //   \\.⎼⎼⎼⎼⎼⎼.       | |   / _ \\| |_| |_ / _ \\ \'_ \\| \'__/ _ \\/ _` | |/ /   \n';
		bean += ' /     ||  /    //   \\      | |__| (_) |  _|  _|  __/ |_) | | |  __/ (_| |   <    \n';
		bean += '▕      || /     ||    \\      \\____\\___/|_| |_|  \\___|_.__/|_|  \\___|\\__,_|_|\\_\\    \n';
		bean += '▕      ||▕      ||    ▕            \n';
		bean += '▕      ||▕      ||    ▕      Version: ' + pkg.version + '    \n';
		bean += ' \\     ||▕      ||    ▕      Server status: down    \n';
		bean += '  \\    // \\     ||    /      Tests: 100    \n';
		bean += '   `⎻⎻⎻⎻⎻⎻´\\   //    /          \n';
		bean += '            `⎻⎻⎻⎻⎻⎻⎻´              \n';
		bean += '\n';
		bean += '01000011·01101111·01100110·01100110·01100101·01100010·01110010·01100101·01100001·01101011\n';
		bean += ' \n';
		console.log(bean);

	};

	return CoffeeBreak;
}();