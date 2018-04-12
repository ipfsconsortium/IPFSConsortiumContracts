const IPFSProxy = artifacts.require("IPFSProxy");
const testHash = 'QmTXUwTJtrUPAT3DppvHd5dvzRNzJPqwWQg6iWxvHhMuxX';
const testMetaDataContract = 'QmTXUwTJtrUPAT3DppvHd5dvzRNzJPqwWQg6iWxvHhMuxX';
const testTTL = 100;
let IPFSProxyInstance;

contract('IPFSProxy', function(accounts) {

	const member1 = accounts[1];
	const member2 = accounts[2];
	const member3 = accounts[3];

	const nonMember = accounts[4];

	describe('Deploy', () => {
		it("should deploy a consortium", function(done) {
			IPFSProxy.new([
				member1,
				member2,
				member3,
			], 2, 10e6, {
				from: accounts[0]
			}).then((_instance) => {
				assert.ok(_instance.address);
				IPFSProxyInstance = _instance;
				done();
			});
		});
	});

	describe('adding / removing hashes', () => {
		it("a member should be able to add a hash", function(done) {
			var events = IPFSProxyInstance.HashAdded({
				fromBlock: "latest"
			});
			var listener = events.watch(function(error, result) {
				listener.stopWatching();
				if (error == null && result.args) {
					//assert.equal(result.args.pubKey, accounts[0]);
					assert.equal(result.args.hash, testHash);
					assert.equal(result.args.ttl, testTTL);
					done();
				} else {
					asset.fail(error);
					done();
				}
			});
			// test if member can add a hash
			IPFSProxyInstance.addHash(testHash, testTTL, {
				from: member1
			});
		});

		it("a non-member account should NOT be able to add a hash", function(done) {
			IPFSProxyInstance.addHash(testHash, testTTL, {
				from: nonMember
			}).then(function(res) {
				assert.fail(null, null, 'this function should throw', e);
				done();
			}).catch(function(e) {
				done();
			});
		});

		it("a member account should be able to delete a hash", function(done) {
			IPFSProxyInstance.removeHash(testHash, {
				from: member1
			}).then(function(res) {
				done();
			}).catch(function(e) {
				assert.fail(null, null, 'this function should throw', e);
				done();
			});
		});

		it("a non-member account should NOT be able to delete a hash", function(done) {
			IPFSProxyInstance.removeHash(testHash, {
				from: nonMember
			}).then(function(res) {
				assert.fail(null, null, 'this function should throw', e);
				done();
			}).catch(function(e) {
				done();
			});

		});
	});


  describe('addMetadataObject / removeMetadataObject', () => {
    it("a member should be able to add a hash", function(done) {
      var events = IPFSProxyInstance.MetadataObjectAdded({
        fromBlock: "latest"
      });
      var listener = events.watch(function(error, result) {
        listener.stopWatching();
        if (error == null && result.args) {
          //assert.equal(result.args.pubKey, accounts[0]);
          assert.equal(result.args.hash, testMetaDataContract);
          //assert.equal(result.args.ttl, testTTL);
          done();
        } else {
          asset.fail(error);
          done();
        }
      });
      // test if member can add a hash
      IPFSProxyInstance.addMetadataObject(testMetaDataContract, {
        from: member1
      });
    });

    it("a non-member account should NOT be able to add a hash", function(done) {
      IPFSProxyInstance.addMetadataObject(testMetaDataContract, {
        from: nonMember
      }).then(function(res) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });

    it("a member account should be able to delete a hash", function(done) {
      IPFSProxyInstance.removeMetadataObject(testMetaDataContract, {
        from: member1
      }).then(function(res) {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      });
    });

    it("a non-member account should NOT be able to delete a hash", function(done) {
      IPFSProxyInstance.removeMetadataObject(testMetaDataContract, {
        from: nonMember
      }).then(function(res) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

	describe('Persist limit changes', () => {
		it("change total persistLimit", function(done) {
			IPFSProxyInstance.setTotalPersistLimit(10000000, {
				from: member1
			}).then(function(res) {
				done();
			}).catch(function(e) {
				assert.fail(null, null, 'this function should not throw', e);
				done();
			});
		});
	});

});
