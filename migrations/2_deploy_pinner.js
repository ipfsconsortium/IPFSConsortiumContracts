const IPFSPinner = artifacts.require("./IPFSPinner.sol");

module.exports = function(deployer) {
	return deployer.deploy(IPFSPinner);
};
