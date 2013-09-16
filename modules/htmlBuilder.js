var log = require('xqnode-logger'),
	// Handlebars = require('handlebars'),
	fs = require('fs');

module.exports = function() {
	"use strict";
	
	var HTMLBuilder = function() {

	};

	/**
	 * Build a HTML page
	 *
	 * @method tmpl
	 * @param type templateName Template name
	 */
	HTMLBuilder.prototype.build = function(templateName) {
		var tmpl = '../templates/mocha-runner.hbs';
		var html = fs.readfileSync(tmpl);
		
		return html;
	};

	return HTMLBuilder;
};