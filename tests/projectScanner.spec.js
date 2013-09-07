var expect = require('expect.js'),
	path = require('path');

describe('Scan project dir', function() {
	var ProjectScanner = require('../lib/projectScanner');
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
				'Example': {
					project: 'Example',
					tests: './tests/**/*.spec.js',
					browser: true
				},
				'ModuleA': {
					project: 'ModuleA',
					tests: './tests/**/*.spec.js',
					browser: true
				},
				'ModuleB': {
					project: 'ModuleB',
					tests: './tests/**/*.spec.js'
				}
			});

			done();
		});
	});
});