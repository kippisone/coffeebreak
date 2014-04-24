module.exports = function(app, callback) {
	'use strict';

	var fs = require('fs'),
		path = require('path');

	var log = require('xqnode-logger');

	var coffeeBreakApp = require('../coffeebreak'),
		HTMLBuilder = require('../modules/htmlBuilder');

	app.get('/cbconf.json', function(req, res) {
		res.json(200, coffeeBreakApp.getPublicConf());
	});

	app.addRoute('get', '/', 'Show CoffeeBreak index page', function(req, res) {
		var projects = coffeeBreakApp.projects;
		console.log('Projects', projects);
		res.render('projectListing', {
			projects: projects
		});
	});

	app.addRoute('get', '/projects', 'Show CoffeeBreak projects overview page', function(req, res) {
		var projects = coffeeBreakApp.projects;
		console.log('Projects', projects);
		res.render('projectListing', {
			projects: projects
		});
	});

	app.get('/projects/:project', function(req, res) {
		res.redirect('./SpecRunner.html');
	});

	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		log.dev('Got request in project ' + projectName, req.path);
		log.dev('Conf', coffeeBreakApp.coffeeBreak);

		if (coffeeBreakApp.projects[projectName]) {
			var conf = coffeeBreakApp.projects[projectName];
			var htmlBuilder = new HTMLBuilder(req, res);
			htmlBuilder.renderSpecRunner(conf);
		}
		else {
			res.render('projectNotFound', {
				project: projectName
			});
		}
	});

/*	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = coffeeBreakApp.projects[projectName],
			file = path.join(conf.cwd, req.params[1]);

		log.dev('Get file ' + file + '', req.params);
		res.sendfile(file);
	});*/

	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = coffeeBreakApp.projects[projectName],
			file;

		
		file = path.join(conf.cwd, req.params[1]);
		if (conf.cwdInstrumented) {
			var instrumentedFile = path.join(conf.cwdInstrumented, req.params[1]);
		console.log('Check file ' + instrumentedFile);
			if (fs.existsSync(instrumentedFile)) {
				file = instrumentedFile;
			}
		}

		res.sendfile(file);
	});

	callback();
};