module.exports = function(app) {
	'use strict';

	var fs = require('fs'),
		path = require('path');

	var log = require('xqnode-logger');

	var cb = require('../coffeebreak');

	app.get('/cbconf.json', function(req, res) {
		res.json(200, cb.coffeeBreak.getPublicConf());
	});
	
	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		log.dev('Got request in project ' + projectName, req.path);
		log.dev('Conf', cb.coffeeBreak);

		if (cb.coffeeBreak.projects[projectName]) {
			var conf = cb.coffeeBreak.projects[projectName];
			res.render('mochaSpecRunner', {
				files: conf.files,
				tests: conf.tests,
				project: conf.project,
				requirejs: conf.requirejs
			});
		}
		else {
			res.render('projectNotFound', {
				project: projectName
			});
		}
		
	});

/*	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = cb.coffeeBreak.projects[projectName],
			file = path.join(conf.cwd, req.params[1]);

		log.dev('Get file ' + file + '', req.params);
		res.sendfile(file);
	});*/

	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = cb.coffeeBreak.projects[projectName],
			file;
		
		file = path.join(conf.cwd, req.params[1]);
		if (conf.cwdInstrumented) {
			var instrumentedFile = path.join(conf.cwdInstrumented, req.params[1]);
		console.log('Check file ' + instrumentedFile);
			if (fs.existsSync(instrumentedFile)) {
				file = instrumentedFile;
			}
		}

		log.dev('Get file ' + file + '', req.params);
		res.sendfile(file);
	});
};