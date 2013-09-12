var glob = require('glob'),
	minimatch = require('minimatch'),
	log = require('xqnode-logger'),
	extend = require('node.extend'),
	path = require('path');

/**
 * @module projectScanner module
 * @return {[type]} [description]
 */
module.exports = function() {
	// "use strict";
	
	/**
	 * @class ProjectScanner
	 */
	var ProjectScanner = function() {
		this.projects = {};
		this.files = [];
	};

	/**
	 * Scans a working dir and looks for project configurtions
	 *
	 * @method scan
	 * @param String dir description
	 * @param Function callback Callback function
	 */
	ProjectScanner.prototype.scan = function(dir, callback) {
		log.dev('\033[38;5;220mScan dir...\033[m', dir);
		glob('**', {
			cwd: dir,
			dot: true
		}, function(err, files) {
			files.forEach(function(file) {
				if (/\.?coffeebreak.json$/.test(file)) {
					log.dev('Parse coffeebreak project configurstion', file);
					var project = require(path.join(dir, file));
					if (!this.projects[project.project]) {
						this.projects[project.project] = {
							files: []
						};
					}

					this.projects[project.project].cwd = path.dirname(path.join(dir, file));
					extend(this.projects[project.project], project);
				}
				
				if (/\.js(on)?$/.test(file)) {
					this.files.push(file);
				}
			}.bind(this));

			log.dev('Project configuration after scan', this.projects);
			callback(null, this.projects);

		}.bind(this));
	};

	return ProjectScanner;
}();