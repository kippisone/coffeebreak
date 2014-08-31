var glob = require('glob'),
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

	var CoffeeBreakProject = function() {
		this.watchIgnore = '(build|dev-build|tmp)/';
	};

	CoffeeBreakProject.prototype.unwatch = function(file) {
		log.dev('Unwatch file: ' + file);
		
		var index = this.watch.indexOf(file);
		if (index) {
			this.watch.splice(index, 1);
			fs.unwatchFile(path.join(this.cwd, file));
			log.dev('... done!');
		}
		else {
			log.dev('... noting to unwatch!');
		}
	};
	
	/**
	 * @class ProjectScanner
	 */
	var ProjectScanner = function() {
		this.projects = {};
		this.files = [];
		this.baseProject = {
		};
	};

	/**
	 * Scans a working dir and looks for project configurtions
	 *
	 * @method scan
	 * @param String dir description
	 * @param Function callback Callback function
	 */
	ProjectScanner.prototype.scan = function(dir, callback) {
		glob('**/+(coffeebreak.json|.coffeebreak.json)', {
			cwd: dir,
			dot: true
		}, function(err, files) {
			files.forEach(function(file) {

				if (/(\/|^)(node_modules|~cb-tmp)\//.test(file)) {
					console.log('Ignode file', file);
					return;
				}

				log.dev('Parse coffeebreak project configuration', file);
				var project = fs.readFileSync(path.join(dir, file));
				if (project) {
					project = JSON.parse(project);
					// project = extend(new CoffeeBreakProject(), project);
					
					var projectDir = path.dirname(path.join(dir, file)),
						projectDirName = project.project.replace(/[^a-zA-Z0-9_-]/g, '');

					
					if (!this.projects[project.project]) {
						this.projects[project.project] = {
							dirName: project.dirName || projectDirName,
							files: this.getProjectFiles(projectDir, project.files || '**/!(*.spec|*.min).js'),
							tests: this.getProjectFiles(projectDir, project.tests || '**/*.spec.js'),
							libs: []
						};

						if (project.watch) {
							this.projects[project.project].watch = this.getProjectFiles(projectDir, project.watch);
						}
					}

					this.projects[project.project].cwd = projectDir;
					this.projects[project.project].tmpDir = this.projects[project.project].tmpDir || path.join(__dirname, '..', 'tmp', project.project);
					var cbProject = new CoffeeBreakProject();
					this.projects[project.project] = extend(true, cbProject, project, this.projects[project.project]);
				}
			}.bind(this));

			// log.dev('Project configuration after scan', this.projects);
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
		log.dev('Scan project folder ' + dir + ' using pattern ' + filePattern);
		log.dev('FilePattern', filePattern);
		var files = [];
		
		if (Array.isArray(filePattern)) {
			filePattern.forEach(function(file) {
				files.concat(glob.sync(file, {
					cwd: dir
				}));
			});

			return files;
		}
		else {
			files = glob.sync(filePattern, {
				cwd: dir
			});
		}
		
		files = files.filter(function(file) {
			return !/(\/|^)(node_modules|~cb-tmp)\//.test(file);
		});

		return files;
	};

	return ProjectScanner;
}();