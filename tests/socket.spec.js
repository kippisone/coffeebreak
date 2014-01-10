'use strict';

var expect = require('expect.js'),
	sinon = require('sinon'),
	sockjs = require('sockjs'),
	log = require('xqnode-logger');

log.setLevel('error');

var Socket = require('../modules/socket');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe.only('Socket', function() {
	describe('initialize', function() {
		it('Should initialize a socket module', function() {
			expect(Socket).to.be.a('function');
		});

		it('Should create an instance of Socket', function() {
			var socket = new Socket();
			expect(socket).to.be.a(Socket);
		});

		it('Should have an event emitter', function() {
			var socket = new Socket();
			expect(socket.emit).to.be.a('function');
		});
	});

	describe('start', function() {
		var createServerStub,
			serverStub,
			instance;

		beforeEach(function() {
			createServerStub = sinon.stub(sockjs, 'createServer');
			serverStub = {
				on: sinon.stub(),
				installHandlers: sinon.stub()
			};

			createServerStub.returns(serverStub);

			instance = new Socket();
		});

		afterEach(function() {
			createServerStub.restore();	
				
		});

		it('Should start a sockjs server', function() {
			instance.start({});
			expect(createServerStub).was.called();
			expect(serverStub.on).was.called();
			expect(serverStub.on).was.calledWith('connection');
			expect(serverStub.installHandlers).was.called();
			expect(serverStub.installHandlers).was.calledWith(sinon.match.object, { prefix:'/cb' });
		});
	});

	describe('stop', function() {
		var instance;

		beforeEach(function() {
			instance = new Socket();
		});

		it('Should disconnect all clients and should shutdown the server', function() {
			var closeStub = sinon.stub();

			instance.connections = [
				{ close: closeStub },
				{ close: closeStub },
				{ close: closeStub }
			];

			instance.stop();
			expect(instance.connections).to.eql([]);
			expect(closeStub).was.calledThrice();
		});
	});
});