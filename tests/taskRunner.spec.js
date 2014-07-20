var expect = require('expect.js'),
    TaskRunner = require('../modules/taskRunner'),
    sinon = require('sinon');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

describe('TaskRunner', function() {
    var taskRunner;

    describe('Instance', function() {
        beforeEach(function() {
            taskRunner = new TaskRunner();
        });

        it('Should be an instance of TaskRunner', function() {
            expect(taskRunner).to.be.an('object');
        });

        it('Should have a registerTask method', function() {
            expect(taskRunner.registerTask).to.be.a('function');
        });

        it('Should have a registerTask method', function() {
            expect(taskRunner.registerTask).to.be.a('function');
        });
    });

    describe('registerTask', function() {
        beforeEach(function() {
            taskRunner = new TaskRunner();
        });

         it('Should register a task', function() {
            var taskFunc = function() {};
            taskRunner.registerTask('test', taskFunc);
            expect(taskRunner.__tasks.test).to.be.an('array');
            expect(taskRunner.__tasks.test).to.have.length(1);
            expect(taskRunner.__tasks.test[0]).to.equal(taskFunc);
        });
    });

    describe('runTasks', function() {
        beforeEach(function() {
            taskRunner = new TaskRunner();
        });

        it('Should run registered tasks', function(done) {
            var task1 = function(conf, logger, done) { done(); };
            var task2 = function(conf, logger, done) { done(); };
            var task3 = function(conf, logger, done) { done(); };
            task1 = sinon.spy(task1);
            task2 = sinon.spy(task2);
            task3 = sinon.spy(task3);

            taskRunner.registerTask('test', task1);
            taskRunner.registerTask('test', task2);
            taskRunner.registerTask('test', task3);

            expect(taskRunner.__tasks.test).to.have.length(3);

            taskRunner.runTasks('test', {}, function() {
                expect(task1).was.calledOnce();
                expect(task2).was.calledOnce();
                expect(task3).was.calledOnce();
                done();
            });
        });
    });
});