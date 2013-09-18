var log = require('xqnode-logger'),
	express = require('express');

module.exports = function() {
	"use strict";

	var app;

	var ExpressServer = function() {
		
	};

	/**
	 * Starts an express server
	 *
	 * @method start
	 */
	ExpressServer.prototype.start = function() {
		log.sys('Starting CoffeeBreak server');

		app = express();
		this.app = app;

		var cbconf = {
			port: 3005
		};

		app.use(express['static'](__dirname + '/public'));
		app.use(express.logger('dev'));
		app.engine('.hbs', require('hbs').__express);
		app.set('view engine', 'hbs');
		app.set('views', '../views');
		app.baseDir = __dirname;

		/**
		 * Routes
		 */
		require('../routes/index.js')(app);

		/**
		 * Static files
		 */
		app.use(express['static']('../public'));

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
		// app.close();
	};

	return new ExpressServer();

}();