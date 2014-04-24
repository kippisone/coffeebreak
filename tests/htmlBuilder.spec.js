var expect = require('expect.js'),
	sinon = require('sinon');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var coffeeBreak = require('../coffeebreak');
coffeeBreak.init('ci', {
	disableServer: true
});

describe('HTMLBuilder', function() {
	
	var HTMLBuilder = require('../modules/htmlBuilder'),
		htmlBuilder;
	
	beforeEach(function() {
		var req = {};
		var res = {
			render: sinon.stub()
		};

		htmlBuilder = new HTMLBuilder(req, res);
	});

	afterEach(function() {

	});

	describe('instance', function() {
		it('Should be a HTMLBUilder instance', function() {
			expect(htmlBuilder).to.be.a(HTMLBuilder);
		});
	});

	describe('renderSpecRunner', function() {
		it('Should render a specRunner html', function() {
			var conf = {};

			var runTasksStub = sinon.stub(coffeeBreak.taskRunner, 'runTasks');
			
			htmlBuilder.renderSpecRunner(conf);
			expect(htmlBuilder.res.render).was.calledOnce();

			expect(runTasksStub).was.calledOnce();
			expect(runTasksStub).was.calledWith('source', conf, sinon.match.func);

			runTasksStub.restore();
		});
	});
});