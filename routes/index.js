module.exports = function(app) {
	"use strict";

	var coffeeBreak = app.coffeeBreak;
	
	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		if (coffeeBreak.projects[projectName]) {
			res.render('mochaRunner', {});
		}
		else {
			res.render('projectNotFound', {
				project: projectName
			});
		}
		
	});
};