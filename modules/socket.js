module.exports = function() {
	"use strict";

	var http = require('http');
	
	var sockjs = require('sockjs');
	
	var echo = sockjs.createServer();
	echo.on('connection', function(conn) {
		conn.on('data', function(message) {
			// conn.write(message);
			console.log('message ' + conn, message);
		});
		conn.on('close', function() {
			console.log('Close socket connection');
		});
	});

	var server = http.createServer();
	echo.installHandlers(server, {prefix:'/echo'});
	server.listen(9999, '0.0.0.0');

	return echo;
}();