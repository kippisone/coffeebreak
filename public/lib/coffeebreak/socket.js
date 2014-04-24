var Socket = (function() {
	'use strict';

	var Socket = function() {
		var self = this;

		this.__onReadyCallbacks = [];

		this.sockJS = new SockJS('http://localhost:9999/cb', null, {
			debug: true
		});

		this.sockJS.onopen = function() {
			// console.log('open');
			self.setReady();
		};

		this.sockJS.onmessage = function(e) {
			// console.log('message', e.data);
		};
		this.sockJS.onclose = function() {
			// console.log('close');
		};
	};

	Socket.prototype.emit = function(eventName, data) {
		this.ready(function() {
			// console.log('[Socket] Send message ', eventName, data);
			this.sockJS.send(JSON.stringify({
				eventName: eventName,
				data: data
			}));
		});
	};

	Socket.prototype.on = function(eventName, callback) {
		
	};

	Socket.prototype.ready = function(fn) {
		if (this.__isReady) {
			fn.call(this);
		}
		else {
			this.__onReadyCallbacks.push(fn);
		}
	};

	Socket.prototype.setReady = function() {
		this.__isReady = true;
		this.__onReadyCallbacks.forEach(function(fn) {
			fn.call(this);
		}.bind(this));

		this.__onReadyCallbacks = [];
	};

	return Socket;

})();