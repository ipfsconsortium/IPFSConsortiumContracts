var IPFSProxy = artifacts.require("IPFSProxy");

var testHash = 'QmTXUwTJtrUPAT3DppvHd5dvzRNzJPqwWQg6iWxvHhMuxX';
var testContract = '0x7433c7c768be4025ab791fb7b2942c3d9e309f3e'
var testTTL = 100;

contract('IPFSProxy', function (accounts) {
  it("a member should be able to add a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {

      var events = instance.HashAdded({
        fromBlock: "latest"
      });
      var listener = events.watch(function (error, result) {
        listener.stopWatching();
        if (error == null && result.args) {
          assert.equal(result.args.pubKey, accounts[0]);
          assert.equal(result.args.hashAdded, testHash);
          assert.equal(result.args.ttl, testTTL);
          done();
        } else {
          asset.fail(error);
          done();
        }
      });

      // test if member can add a hash
      instance.addHash(testHash, testTTL, {
        from: accounts[0]
      });
    }).then(function () {
    });
  });

  it("a non-member account (accounts[1]) should NOT be able to add a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addHash(testHash, testTTL, {
        from: accounts[1]
      }).then(function (res) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function (e) {
        done();
      });
    });
  });

  it("a member account (accounts[0]) should be able to delete a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.removeHash(testHash, {
        from: accounts[0]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      });
    });
  });

  it("a member account (accounts[1]) should NOT be able to delete a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.removeHash(testHash, {
        from: accounts[1]
      }).then(function (res) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function (e) {
        done();
      });
    });
  });

  it("a member should be able to add a member (accounts[1])", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addMember(accounts[1], {
        from: accounts[0]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should throw');
        done();
      });
    });
  });


  it("a member account (accounts[1]) should now be able to add a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addHash(testHash, testTTL, {
        from: accounts[1]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("change ban threshold", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.updateBanThreshold(2, {
        from: accounts[0]
      }).then(async function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("a member account (accounts[1]) should be able to change the changeRequirement value", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.changeRequirement(2, {
        from: accounts[1]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("a new member need changeRequirement Confirmation before be a member and add a hash", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addMember(accounts[2], {
        from: accounts[0]
      }).then(function (res) {
        IPFSProxy.deployed().then(function (instance) {
          instance.addHash(testHash, testTTL, {
            from: accounts[2]
          }).then(function (res) {
            done();
            assert.fail(null, null, 'this function should not throw', e);
          }).catch(function (e) {
            IPFSProxy.deployed().then(function (instance) {
              instance.addMember(accounts[2], {
                from: accounts[1]
              }).then(function (res) {
                IPFSProxy.deployed().then(function (instance) {
                  instance.addHash(testHash, testTTL, {
                    from: accounts[2]
                  }).then(function (res) {
                    done();
                  }).catch(function (e) {
                    assert.fail(null, null, 'this function should not throw', e);
                    done();
                  });
                });
              }).catch(function (e) {
                assert.fail(null, null, 'this function should throw');
                done();
              });
            });
          });
        });
      }).catch(function (e) {
        assert.fail(null, null, 'this function should throw');
        done();
      });
    });
  });

  it("ban a cheating user, could add a HASH", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.banMember(accounts[2], "", {
        from: accounts[1]
      }).then(function (res) {
        IPFSProxy.deployed().then(function (instance) {
          instance.addHash(testHash, testTTL, {
            from: accounts[2]
          }).then(function (res) {
            done();
          }).catch(function (e) {
            assert.fail(null, null, 'this function should not throw', e);
            done();
          });
        });
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("after {changeRequirement} confirmations of ban a cheating user and overcome the threshold the user must be deleted, NOT be able to add HASH", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.banMember(accounts[2], "", {
        from: accounts[0]
      }).then(function (res) {
        IPFSProxy.deployed().then(function (instance) {
          instance.addHash(testHash, testTTL, {
            from: accounts[2]
          }).then(function (res) {
            assert.fail(null, null, 'this function should not throw', e);
            done();
          }).catch(function (e) {
            done();
          });
        });
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });
  

  it("change total persistLimit", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.setTotalPersistLimit(10000000, {
        from: accounts[0]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("a member (accounts[0]) should be able to add a contract", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addContract(testContract,testTTL, {
        from: accounts[0]
      }).then(function (res) {
        done();
      }).catch(function (e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

  it("a member (accounts[1]) should be able to remove a contract", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.removeContract(testContract, {
        from: accounts[1]
      }).then(function (res) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      }).catch(function (e) {
        done();
      });
    });
  });

  it("a non-member (accounts[2]) should be NOT able to add a contract", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.addContract(testContract,testTTL, {
        from: accounts[2]
      }).then(function (res) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      }).catch(function (e) {
        done();
      });
    });
  });

  it("a non-member (accounts[2]) should be NOT able to remove a contract", function (done) {
    IPFSProxy.deployed().then(function (instance) {
      instance.removeContract(testContract,testTTL, {
        from: accounts[2]
      }).then(function (res) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      }).catch(function (e) {
        done();
      });
    });
  });
});
