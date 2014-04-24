var expect = require('expect.js'),
	sinon = require('sinon');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var coffeeBreak = require('../coffeebreak');
coffeeBreak.init('ci', {
	disableServer: true
});

describe('SourceTask', function() {
	var SourceTask = require('../modules/sourceTask');
	
	var sourceTask;

	beforeEach(function() {
		sourceTask = new SourceTask();
	});

	afterEach(function() {

	});

	describe('Instance', function() {
		it('Should be an instance of SourceTask', function() {
			expect(sourceTask).to.be.a(SourceTask);
		});
	});

	describe('addScript', function() {
		it('Should add a js script to SpecRunner.html', function() {
			sourceTask.addScript('test.js', '../path/test.js');
		});
	});
});