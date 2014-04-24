var log = require('xqnode-logger');

var coffeeBreak = require('../coffeebreak'),
	taskRunner = coffeeBreak.taskRunner;

module.exports = function() {
	"use strict";
	
	var HTMLBuilder = function(req, res) {
		this.req = req;
		this.res = res;
	};

	/**
	 * Build a HTML page
	 *
	 * @method tmpl
	 * @param type templateName Template name
	 */
	HTMLBuilder.prototype.renderSpecRunner = function(conf) {
		log.dev('Render SpecRunner', conf);

		taskRunner.runTasks('source', conf, function(err, state) {
			if (err) {
				log.error('Source task failed!', err);
				return;
			}

			console.log('Task state:', state);
		});

		this.res.render('mochaSpecRunner', {
			files: conf.files,
			tests: conf.tests,
			filesArray: '\'' + conf.files.join('\',\'') + '\'',
			testsArray: '\'' + conf.tests.join('\',\'') + '\'',
			project: conf.project,
			requirejs: conf.requirejs,
			jsfiles: conf.jsfiles,
			libs: conf.libs
		});
	};

	return HTMLBuilder;
}();