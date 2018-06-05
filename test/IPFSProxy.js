const IPFSPinner = artifacts.require("IPFSPinner.sol");

contract('IPFSPinner.', function(accounts) {

	describe('Deploy', () => {
		it("should deploy a consortium", function(done) {
			IPFSPinner.new().then((_instance) => {
				assert.ok(_instance.address);
				IPFSPinnerInstance = _instance;
				done();
			});
		});
	});

	describe('adding / removing metadata', () => {
		it("a member should be able to add a hash", function(done) {
			IPFSPinnerInstance.addMetaData("QmNOGIETS");
			done();
		});
	});

});
