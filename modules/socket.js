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

	Socket.prototype.start = function() {
		log.sys('Start SocketServer on port ' + this.port);

		sockjsServer = sockjs.createServer();
		sockjsServer.on('connection', function(conn) {
			// console.log('New connection', conn);

			conn.on('data', function(message) {
				log.sys('Recive socket message:', message);
				message = JSON.parse(message);
				this.__emit(message.eventName, message.data);
			}.bind(this));
			
			conn.on('close', function() {
				log.sys('Close socket connection', conn);

				for (var i = 0, len = this.connections.length; i < len; i++) {
					if (this.connections[i] === conn) {
						this.connections.splice(i, 1);
						break;
					}
				}
			}.bind(this));
		}.bind(this));

		var server = http.createServer();
		sockjsServer.installHandlers(server, {prefix:'/cb'});
		server.listen(this.port, this.host);
	};

	Socket.prototype.__emit = Socket.prototype.emit;

	Socket.prototype.stop = function() {
		log.sys('Stop SocketServer');
		var numClients = this.connections.length;
		this.connections.forEach(function(conn) {
			conn.close();
		});

		this.connections = [];

		log.sys('  ' + numClients + ' disconnected');
	};

	Socket.prototype.emit = function(eventName, data) {
		this.connections.forEach(function(conn) {
			conn.write({
				eventName: eventName,
				data: data
			});
		});
	};

	return Socket;
}();