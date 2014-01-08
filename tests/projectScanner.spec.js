var expect = require('expect.js'),
	path = require('path');

describe('Scan project dir', function() {
	var ProjectScanner = require('../modules/projectScanner');
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('It should scan a workingdir', function(done) {
		var projectScanner = new ProjectScanner();
		projectScanner.scan(path.join(__dirname, '../example'), function(err, data) {
			expect(err).to.be(null);
			expect(data).to.be.an('object');
			expect(data.ModuleA).to.eql({
				project: 'ModuleA',
				browser: true,
				cwd: path.join(__dirname, '../example/modules/moduleA'),
				files: ['lib/lib1.js', 'lib/lib2.js', 'lib/lib3.js', 'modulea.js', 'superModule.js'],
				tests: ['specs/test1.spec.js', 'specs/test2.spec.js'],
				dirName: 'ModuleA',
				watchIgnore: '(build|dev-build|tmp)/'
			});
			expect(data.ModuleB).to.eql({
				project: 'ModuleB',
				cwd: path.join(__dirname, '../example/modules/moduleB'),
				files: ['moduleb.js'],
				tests: ['specs/test1.spec.js'],
				dirName: 'ModuleB',
				watchIgnore: '(build|dev-build|tmp)/'
			});
			

			done();
		});
	});
});