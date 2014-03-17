var expect = require('expect.js')

describe('CoffeeBreak', function() {
	var CoffeeBreak = require('../modules/coffeeBreak'),
		coffeeBreak;

	before(function(done) {
		coffeeBreak = new CoffeeBreak();

		coffeeBreak.once('ready', function() {
			done();
		});

		coffeeBreak.init();
	});

	after(function(done) {
		coffeeBreak.stop();
		setTimeout(done, 500);
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
		
		it.skip('Should be a coffeeBreak.htmlBuilder object', function() {
			expect(coffeeBreak.htmlBuilder).to.be.an('object');
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