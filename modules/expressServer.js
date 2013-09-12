var log = require('xqnode-logger'),
	express = require('express');

module.exports = function() {
	"use strict";

	var app;

	var ExpressServer = function() {
		this.app = app;
	};

	/**
	 * Starts an express server
	 *
	 * @method start
	 */
	ExpressServer.prototype.start = function() {
		log.sys('Starting CoffeeBreak server');

		app = express();

		var cbconf = {
			port: 3005
		};

		app.use(express['static'](__dirname + '/public'));
		app.use(express.logger('dev'));
		app.set('view engine', 'hbs');
		app.engine('html', require('hbs').__express);
		app.baseDir = __dirname;

		/**
		 * Routes
		 */
		require('../routes/index.js')(app);

		app.use(function(err, req, res, next) {
		  console.error(err.stack);
		  res.send(500, 'Something broke!');
		});

		app.listen(cbconf.port);
		log.sys(' ... listening on port ', cbconf.port);

		return app;	
	};

	/**
	 * Stopping express server
	 */
	ExpressServer.prototype.stop = function() {
		log.sys('Stoping CoffeeBreak server');
		process.exit();
	};

	return new ExpressServer();

}();