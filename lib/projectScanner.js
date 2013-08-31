var glob = require('glob'),
	minimatch = require('minimatch'),
	log = require('xqnode-logger');

module.exports = function() {
	// "use strict";
	
	var ProjectScanner = function() {

	};

	/**
	 * [description]
	 *
	 * @method scan
	 * @param String dir description
	 * @param Function callback Callback function
	 */
	ProjectScanner.prototype.scan = function(dir, callback) {
		console.log('\033[39;5;#mScan...\033[m');
		console.log('\033[38;5;220mScan...\033[m');
		glob('**', function(err, files) {
			files.forEach(function(file) {
				log.dev('File: ', file);
			});
		});
	};

	return ProjectScanner;
}();