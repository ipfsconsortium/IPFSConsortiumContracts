pragma solidity ^0.4.19;

import "./IPFSEvents.sol";
import "./Multimember.sol";

contract IPFSProxy is IPFSEvents, Multimember {
    uint public persistLimit;

    event PersistLimitChanged(uint limit);	
    event ContractAdded(address pubKey,uint startBlock);
    event ContractRemoved(address pubKey);

    /**
    * @dev Constructor - adds the owner of the contract to the list of valid members
    */
    function IPFSProxy(address[] _members,uint _required, uint _persistlimit) Multimember (_members, _required) public {
        setTotalPersistLimit(_persistlimit);
        for (uint i = 0; i < _members.length; ++i) {
            MemberAdded(_members[i]);
        }
        addContract(this,block.number);
    }

    /**
    * @dev Add hash to persistent storage
    * @param _ipfsHash The ipfs hash to propagate.
    * @param _ttl amount of time is seconds to persist this. 0 = infinite
    */
    function addHash(string _ipfsHash, uint _ttl) public onlymember {
        HashAdded(_ipfsHash,_ttl);
    }

    /**
    * @dev Remove hash from persistent storage
    * @param _ipfsHash The ipfs hash to propagate.	
    */
    function removeHash(string _ipfsHash) public onlymember {
        HashRemoved(_ipfsHash);
    }

   /** 
    * Add a contract to watch list. Each proxy will then 
    * watch it for HashAdded and HashRemoved events 
    * and cache these events
    * @param _contractAddress The contract address.
    * @param _startBlock The startblock where to look for events.
    */
    function addContract(address _contractAddress,uint _startBlock) public onlymember {
        ContractAdded(_contractAddress,_startBlock);
    }

    /**
    * @dev Remove contract from watch list
    */
    function removeContract(address _contractAddress) public onlymember {
        require(_contractAddress != address(this));
        ContractRemoved(_contractAddress);
    }

   /** 
    * Add a metadata of an object. Each proxy will then 
    * read the ipfs hash file with the metadata about the object and parse it 
    */
    function addMetadataObject(string _metadataHash) public onlymember {
        HashAdded(_metadataHash,0);
        MetadataObjectAdded(_metadataHash);
    }

    /** 
    * removed a metadata of an object.
    */
    function removeMetadataObject(string _metadataHash) public onlymember {
        HashRemoved(_metadataHash);
        MetadataObjectRemoved(_metadataHash);
    }

    /**
    * @dev set total allowed upload
    *
    **/
    function setTotalPersistLimit (uint _limit) public onlymanymembers(keccak256(_limit)) {
        persistLimit = _limit;
        PersistLimitChanged(_limit);
    }
}
