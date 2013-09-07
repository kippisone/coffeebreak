var expect = require('expect.js'),
	TestRunner = require('../lib/testRunner'),
	sinon = require('sinon');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe('Testrunner', function() {
var testRunner;
	before(function() {
		testRunner = new TestRunner();
	});

	afterEach(function() {

	});

	it('Should run a node test', function(done) {
		var execStub = sinon.stub(require('child_process'), 'exec');
		testRunner.run({
			project: 'Test Mobule',
			tests: './tests/**/*.spec.js',
			cwd: '/tmp/example'
		}, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.eql({});
			expect(execStub).was.called();


			execStub.restore();
			done();
		});
	});

	it('Should run a frontend test', function(done) {
		
	});
});
