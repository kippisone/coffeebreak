module.exports = function(app) {
	"use strict";

	var coffeeBreak = require('../modules/coffeeBreak'),
		log = require('xqnode-logger');
	
	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		log.dev('Got request in project ' + projectName, req.path);
		log.dev('Conf', coffeeBreak);

		if (coffeeBreak.projects[projectName]) {
			res.render('mochaSpecRunner', {});
		}
		else {
			res.render('projectNotFound', {
				project: projectName
			});
		}
		
	});
};