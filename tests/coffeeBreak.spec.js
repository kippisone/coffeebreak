var expect = require('expect.js'),
	sinon = require('sinon'),
	log = require('xqnode-logger');

log.setLevel('warn');

var Socket = require('../modules/socket');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe('CoffeeBreak', function() {
	var CoffeeBreak = require('../modules/coffeeBreak'),
		coffeeBreak;

	var socketStartStub = sinon.stub(Socket.prototype, 'start'),
		testRunnerStub = sinon.stub(CoffeeBreak.prototype, 'runTests'),
		scanProjectStub = sinon.stub(CoffeeBreak.prototype, 'scanProject');

	before(function(done) {
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
	});

	describe('Instance', function() {
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
});