const IPFSPinner = artifacts.require("./IPFSPinner.sol");

module.exports = function(deployer) {

	deployer.then(function() {
		return IPFSPinner.deployed();
	}).then(function(instance) {
		return instance.addMetaData('Qm');
	});


};
