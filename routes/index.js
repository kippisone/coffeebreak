module.exports = function(app) {
	"use strict";

	var fs = require('fs'),
		path = require('path');

	var log = require('xqnode-logger');

	app.get('/cbconf.json', function(req, res) {
		res.json(200, app.coffeeBreak.getPublicConf());
	});
	
	app.get('/projects/:project/SpecRunner.html', function(req, res) {
		//htmlBuilder.build('mocha-index');
		var projectName = req.param('project');
		log.dev('Got request in project ' + projectName, req.path);
		log.dev('Conf', app.coffeeBreak);

		if (app.coffeeBreak.projects[projectName]) {
			var conf = app.coffeeBreak.projects[projectName];
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

	// app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
	// 	var projectName = req.params[0],
	// 		conf = app.coffeeBreak.projects[projectName],
	// 		file = path.join(conf.cwd, req.params[1]);

	// 	log.dev('Get file ' + file + '', req.params);
	// 	res.sendfile(file);
	// });

	app.get(/\/projects\/([a-zA-Z0-9_-]+)\/(.*)$/, function(req, res) {
		var projectName = req.params[0],
			conf = app.coffeeBreak.projects[projectName],
			file;
		
		console.log('FILE', conf);
		file = path.join(conf.cwd, req.params[1]);
		if (conf.cwdInstrumented) {
			var instrumentedFile = path.join(conf.cwdInstrumented, req.params[1]);
		console.log('Check file ' + instrumentedFile);
			if (fs.existsSync(instrumentedFile)) {
				file = instrumentedFile;
			}
		}

		console.log('Get file ' + file + '', req.params);
		log.dev('Get file ' + file + '', req.params);
		res.sendfile(file);
	});
};