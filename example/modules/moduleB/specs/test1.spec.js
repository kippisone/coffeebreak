describe('TestMethod', function() {
	it('Should get an instance of TestMethod', function() {
		var instance = require('../moduleb');
		expect(instance).to.be.an('object');
	});

	it('Should set NODE_ENV to test', function() {
		expect(process.env.NODE_ENV).to.eql('test');
	});
});