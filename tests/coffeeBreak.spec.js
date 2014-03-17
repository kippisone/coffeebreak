var expect = require('expect.js')

describe('CoffeeBreak', function() {
	var coffeeBreak = require('../modules/coffeeBreak');

	beforeEach(function() {

	});

	afterEach(function() {

	});

	describe('Instance', function() {
		it('Should be a coffeeBreak object', function() {
			expect(coffeeBreak).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.app).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.taskRunner).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.testRunner).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.htmlBuilder).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.expressServer).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.socket).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.projectScanner).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.utils).to.be.an('object');
		});
		
		it('Should be a express.app object', function() {
			expect(coffeeBreak.projects).to.be.an('object');
		});
	});
});