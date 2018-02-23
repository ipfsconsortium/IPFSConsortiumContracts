var HashtagProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(deployer) {
  deployer.deploy(HashtagProxy);
};
