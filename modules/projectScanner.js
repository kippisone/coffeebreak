var glob = require('glob'),
	minimatch = require('minimatch'),
	log = require('xqnode-logger'),
	extend = require('node.extend'),
	path = require('path'),
	fs = require('fs');

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
		glob('**/+(coffeebreak.json|.coffeebreak.json)', {
			cwd: dir,
			dot: true
		}, function(err, files) {
			files.forEach(function(file) {
				log.dev('Parse coffeebreak project configurstion', file);
				var project = fs.readFileSync(path.join(dir, file));
				if (project) {
					project = JSON.parse(project);
					
					var projectDir = path.dirname(path.join(dir, file)),
						projectDirName = project.project.replace(/[^a-zA-Z0-9_-]/g, '');

					
					if (!this.projects[project.project]) {
						this.projects[project.project] = {
							dirName: project.dirName || projectDirName,
							files: this.getProjectFiles(projectDir, project.files || '**/!(*.spec|*.min).js'),
							tests: this.getProjectFiles(projectDir, project.tests || '**/*.spec.js')
						};
					}

					this.projects[project.project].cwd = projectDir;
					this.projects[project.project] = extend(true, project, this.projects[project.project]);
				}
			}.bind(this));

			log.dev('Project configuration after scan', this.projects);
			callback(null, this.projects);

		}.bind(this));
	};

	/**
	 * Scan a project folder and returns a files array
	 *
	 * @method getProjectFiles
	 * @param {String} filePattern File pattern
	 */
	ProjectScanner.prototype.getProjectFiles = function(dir, filePattern) {
		if (Array.isArray(filePattern)) {
			log.dev('Skip file pattern, is an array', filePattern);
			return filePattern;
		}
		
		log.dev('Scan project folder ' + dir + ' using pattern ' + filePattern);
		return glob.sync(filePattern, {
			cwd: dir
		});
	};

	return ProjectScanner;
}();