module.exports = function(app) {
	"use strict";

	var coffeeBreak = require('../modules/coffeeBreak'),
		log = require('xqnode-logger'),
		path = require('path');

	app.get('/cbconf.json', function(req, res) {
		res.json(200, coffeeBreak.getPublicConf());
	});
	
	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		log.dev('Got request in project ' + projectName, req.path);
		log.dev('Conf', coffeeBreak);

		if (coffeeBreak.projects[projectName]) {
			var conf = coffeeBreak.projects[projectName];
			res.render('mochaSpecRunner', {
				files: conf.files,
				tests: conf.tests,
				project: conf.project
			});
		}
		else {
			res.render('projectNotFound', {
				project: projectName
			});
		}
		
	});

	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = coffeeBreak.projects[projectName],
			file = path.join(conf.cwd, req.params[1]);

		log.dev('Get file ' + file + '', req.params);
		res.sendfile(file);
	});
};