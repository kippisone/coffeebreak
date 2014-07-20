var expect = require('expect.js'),
	TestRunner = require('../modules/testRunner'),
	sinon = require('sinon');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe('Testrunner', function() {
var testRunner;

	describe('instance', function() {
		beforeEach(function() {
			testRunner = new TestRunner();
		});

		it('Should be an instance of TestRunner', function() {
			expect(testRunner).to.be.a(TestRunner);
		});

		it('Should have a .run() method', function() {
			expect(testRunner.run).to.be.a('function');
		});
	});

	describe('run', function() {
		var projectConf;

		before(function() {
			projectConf = {
				'test1': { name: 'test1' },
				'test2': { name: 'test2' }
			};

			testRunner = new TestRunner();
		});

		afterEach(function() {

		});

		it('Should run all tests', function(done) {
			var runOneStub = sinon.stub(testRunner, 'runOne');
			runOneStub.yields(null, true);
			var cb = function() {

				expect(runOneStub).was.calledTwice();
				runOneStub.restore();
				done();
			};

			testRunner.run(projectConf, cb);

		});

		it('Should call hooks', function(done) {
			var runTaskStub = sinon.stub();
			runTaskStub.yields();
			testRunner.taskRunner = {
				runTasks: runTaskStub
			};

			testRunner.coffeeBreak = {
				codeCoverage: false
			};

			testRunner.runOne(projectConf.test1, function() {
				done();
			});

			expect(runTaskStub).was.callCount(4);
			expect(runTaskStub.getCall(0).args[0]).to.eql('prepare');
			expect(runTaskStub.getCall(1).args[0]).to.eql('test');
			expect(runTaskStub.getCall(2).args[0]).to.eql('report');
			expect(runTaskStub.getCall(3).args[0]).to.eql('clean');
		});

		it('Should call hooks (codeCoverage enabled)', function(done) {
			var runTaskStub = sinon.stub();
			runTaskStub.yields();
			testRunner.taskRunner = {
				runTasks: runTaskStub
			};

			testRunner.coffeeBreak = {
				codeCoverage: true
			};

			testRunner.runOne(projectConf.test1, function() {
				done();
			});

			expect(runTaskStub).was.callCount(5);
			expect(runTaskStub.getCall(0).args[0]).to.eql('prepare');
			expect(runTaskStub.getCall(1).args[0]).to.eql('coverage');
			expect(runTaskStub.getCall(2).args[0]).to.eql('test');
			expect(runTaskStub.getCall(3).args[0]).to.eql('report');
			expect(runTaskStub.getCall(4).args[0]).to.eql('clean');
		});

		xit('Should run a node test', function(done) {
			var execStub = sinon.stub(testRunner, 'runOne');
			execStub.yields(null, 'done', '');
			testRunner.run({
				project: 'Test Mobule',
				tests: './tests/**/*.spec.js',
				cwd: '/tmp/example'
			}, function(err, result) {
				expect(err).to.be(null);
				expect(result).to.eql({});
				expect(execStub).was.called();
				expect(execStub).was.calledWith('mocha ./tests/**/*.spec.js', {
					cwd: '/tmp/example'
				}, sinon.match.func);


				execStub.restore();
				done();
			});
		});

		it('Should run a frontend test', function(done) {
			done();
		});
	});
});
