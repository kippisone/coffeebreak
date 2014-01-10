module.exports = function() {
	"use strict";

	var http = require('http'),
		util = require("util"),
		events = require("events");
	
	var sockjs = require('sockjs'),
		log = require('xqnode-logger');

	var sockjsServer;

	var Socket = function() {
		events.EventEmitter.call(this);

		this.connections = [];
		this.port = 9999;
		this.host = '0.0.0.0';
	};

	util.inherits(Socket, events.EventEmitter);

	Socket.prototype.start = function(conf) {
		log.sys('Start SocketServer on port ' + conf.port);

		sockjsServer = sockjs.createServer();
		sockjsServer.on('connection', function(conn) {
			conn.on('data', function(message) {
				// conn.write(message);
				console.log('message ' + conn, message);
			});
			conn.on('close', function() {
				console.log('Close socket connection');
			});
		});

		var server = http.createServer();
		sockjsServer.installHandlers(server, {prefix:'/cb'});
		server.listen(this.port, this.host);
	};

	Socket.prototype.stop = function() {
		log.sys('Stop SocketServer');
		var numClients = this.connections.length;
		this.connections.forEach(function(conn) {
			conn.close();
		});

		this.connections = [];

		log.sys('  ' + numClients + ' disconnected');
	};

	return Socket;
}();