define(['chai'], function (chai) {
	console.log('im loaded');

	var expect = chai.expect;

	describe("Upload", function() {
		describe("constructor", function() {
	    	it("should have a default name", function() {
	      		expect("1").to.equal("1");
	    	});
		});
	});
	
});

