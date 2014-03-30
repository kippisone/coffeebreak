var expect = require('expect.js'),
	sinon = require('sinon'),
	log = require('xqnode-logger');

log.setLevel('warn');

var Socket = require('../modules/socket');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe('CoffeeBreak', function() {
	var CoffeeBreak = require('../modules/coffeeBreak'),
		coffeeBreak;

	var socketStartStub,
		testRunnerStub,
		startCIStub,
		stopStub,
		scanProjectStub;



	describe('Default instance', function() {
		before(function(done) {
			socketStartStub = sinon.stub(Socket.prototype, 'start');
			testRunnerStub = sinon.stub(CoffeeBreak.prototype, 'runTests');
			scanProjectStub = sinon.stub(CoffeeBreak.prototype, 'scanProject');

			coffeeBreak = new CoffeeBreak();

			coffeeBreak.once('ready', function() {
				done();
			});

			coffeeBreak.init('default', {
				disableServer: true
			});

			expect(socketStartStub).was.calledOnce();
				expect(scanProjectStub).was.calledOnce();
				scanProjectStub.yield();
				expect(testRunnerStub).was.calledOnce();
		});

		after(function(done) {
			coffeeBreak.stop();
			setTimeout(done, 500);
			socketStartStub.restore();
			testRunnerStub.restore();
			scanProjectStub.restore();
		});

		it('Should be a coffeeBreak object', function() {
			expect(coffeeBreak).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.app).to.be.an('function');
		});
		
		it('Should be a coffeeBreak.taskRunner object', function() {
			expect(coffeeBreak.taskRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.testRunner object', function() {
			expect(coffeeBreak.testRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.expressServer object', function() {
			expect(coffeeBreak.expressServer).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.socket object', function() {
			expect(coffeeBreak.socket).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.projects object', function() {
			expect(coffeeBreak.projects).to.be.an('object');
		});
	});

	describe('Server instance', function() {

		before(function(done) {
			socketStartStub = sinon.stub(Socket.prototype, 'start');
			testRunnerStub = sinon.stub(CoffeeBreak.prototype, 'runTests');
			scanProjectStub = sinon.stub(CoffeeBreak.prototype, 'scanProject');

			coffeeBreak = new CoffeeBreak();

			coffeeBreak.once('ready', function() {
				done();
			});

			coffeeBreak.init('server', {
				disableServer: true
			});

			expect(socketStartStub).was.calledOnce();
			expect(scanProjectStub).was.calledOnce();
			expect(testRunnerStub).was.notCalled();
		});

		after(function(done) {
			coffeeBreak.stop();
			setTimeout(done, 500);
			socketStartStub.restore();
			testRunnerStub.restore();
			scanProjectStub.restore();
		});

		it('Should be a coffeeBreak object', function() {
			expect(coffeeBreak).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.app).to.be.an('function');
		});
		
		it('Should be a coffeeBreak.taskRunner object', function() {
			expect(coffeeBreak.taskRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.testRunner object', function() {
			expect(coffeeBreak.testRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.expressServer object', function() {
			expect(coffeeBreak.expressServer).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.socket object', function() {
			expect(coffeeBreak.socket).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.projects object', function() {
			expect(coffeeBreak.projects).to.be.an('object');
		});
	});

	describe('CI instance', function() {
		before(function(done) {
			socketStartStub = sinon.stub(Socket.prototype, 'start');
			startCIStub = sinon.spy(CoffeeBreak.prototype, 'startCI');
			stopStub = sinon.spy(CoffeeBreak.prototype, 'stop');
			testRunnerStub = sinon.stub(CoffeeBreak.prototype, 'runTests');
			scanProjectStub = sinon.stub(CoffeeBreak.prototype, 'scanProject');

			coffeeBreak = new CoffeeBreak();

			coffeeBreak.once('ready', function() {
				done();
			});

			coffeeBreak.init('ci', {
				disableServer: true
			});

			expect(startCIStub).was.calledOnce();
			expect(socketStartStub).was.calledOnce();
			expect(scanProjectStub).was.calledOnce();
			scanProjectStub.yield();
			expect(testRunnerStub).was.calledOnce();
		});

		after(function(done) {
			coffeeBreak.stop();
			setTimeout(done, 500);
			socketStartStub.restore();
			testRunnerStub.restore();
			scanProjectStub.restore();
			stopStub.restore();
		});

		it('Should be a coffeeBreak object', function() {
			expect(coffeeBreak).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.app).to.be.an('function');
		});
		
		it('Should be a coffeeBreak.taskRunner object', function() {
			expect(coffeeBreak.taskRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.testRunner object', function() {
			expect(coffeeBreak.testRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.expressServer object', function() {
			expect(coffeeBreak.expressServer).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.socket object', function() {
			expect(coffeeBreak.socket).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.projects object', function() {
			expect(coffeeBreak.projects).to.be.an('object');
		});
	});

	describe('Start instance', function() {
		before(function() {
			socketStartStub = sinon.stub(Socket.prototype, 'start');
			testRunnerStub = sinon.stub(CoffeeBreak.prototype, 'runTests');
			scanProjectStub = sinon.stub(CoffeeBreak.prototype, 'scanProject');

			coffeeBreak = new CoffeeBreak();
			coffeeBreak.init('start', {
				disableServer: true
			});

			expect(socketStartStub).was.notCalled();
			expect(scanProjectStub).was.calledOnce();
			scanProjectStub.yield();
			expect(testRunnerStub).was.calledOnce();
		});

		after(function() {
			socketStartStub.restore();
			testRunnerStub.restore();
			scanProjectStub.restore();
		});

		it('Should be a coffeeBreak object', function() {
			expect(coffeeBreak).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.app).to.be(undefined);
		});
		
		it('Should be a coffeeBreak.taskRunner object', function() {
			expect(coffeeBreak.taskRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.testRunner object', function() {
			expect(coffeeBreak.testRunner).to.be.an('object');
		});
		
		it('Should be a coffeeBreak.expressServer object', function() {
			expect(coffeeBreak.expressServer).to.be(undefined);
		});
		
		it('Should be a coffeeBreak.socket object', function() {
			expect(coffeeBreak.socket).to.be(undefined);
		});
		
		it('Should be a coffeeBreak.projects object', function() {
			expect(coffeeBreak.projects).to.be.an('object');
		});
	});
});