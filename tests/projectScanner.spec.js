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
			expect(data).to.eql({
				'ModuleA': {
					project: 'ModuleA',
					browser: true,
					cwd: path.join(__dirname, '../example/modules/moduleA'),
					files: ['lib/lib1.js', 'lib/lib2.js', 'modulea.js'],
					tests: ['specs/test1.spec.js', 'specs/test2.spec.js']
				},
				'ModuleB': {
					project: 'ModuleB',
					cwd: path.join(__dirname, '../example/modules/moduleB'),
					files: ['moduleb.js'],
					tests: ['specs/test1.spec.js']
				},
				'ModuleC': {
					project: 'ModuleC',
					cwd: path.join(__dirname, '../example/modules/moduleC'),
					files: ['modulec.js'],
					tests: ['specs/test1.spec.js', 'specs/test2.spec.js', 'specs/test3.spec.js']
				}
			});

			done();
		});
	});
});