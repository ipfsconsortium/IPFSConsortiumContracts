pragma solidity ^0.4.11;


import "./IPFSEvents.sol";
import "./Multimember.sol";


contract IPFSProxy is IPFSEvents, Multimember {
    mapping(address => mapping( address => bool)) public complained;
    mapping(address => uint) public complaint;
    uint public banThreshold;
    uint public sizeLimit;
    address[] members;
    
    /**
    * @dev Throws if called by any account other than a valid member. 
    */
    modifier onlyValidMembers {
        require (isMember(msg.sender));
        _;
    }

    event ContractAdded(address owner, address pubKey, uint ttl);
    event MetadataContractAdded(address owner, string metadataHash);
    event ContractRemoved(address owner, address pubKey);
    event Banned(string consoritumHash);
    event BanAttempt(address complainer, address member, uint complaints);
    event PersistLimitChanged(uint limit);	

    /**
    * @dev Constructor - adds the owner of the contract to the list of valid members
    */
    function IPFSProxy() Multimember (members, 1) public {
        addContract(this, 0);
        updateBanThreshold(1);
        setTotalPersistLimit(10000000000); //10 GB
    }

    /**
    * @dev Add hash to persistent storage
    * @param ipfsHash The ipfs hash to propagate.
    * @param ttl amount of time is seconds to persist this. 
    */
    function addHash(string ipfsHash, uint ttl) public onlyValidMembers {
        HashAdded(msg.sender,ipfsHash,ttl);
    }

    /**
    * @dev Remove hash from persistent storage
    * @param ipfsHash The ipfs hash to propagate.	
    */
    function removeHash(string ipfsHash) public onlyValidMembers {
        HashRemoved(msg.sender,ipfsHash);
    }

    /** 
    * Add a contract to watch list. Each node will then 
    * watch it for `HashAdded(msg.sender,ipfsHash,ttlv);` 
    * events and it will cache these events
    */
    function addContract(address toWatch, uint ttl) public onlyValidMembers {
        ContractAdded(msg.sender, toWatch, ttl);
    }

    /** 
    * Add a metadata of a contract to watch list. Each node will then 
    * read the ipfs hash file with the metadata about the contract 
    */
    function metadataContractAdded(string _metadataHash) public onlyValidMembers {
        MetadataContractAdded(msg.sender, _metadataHash);
    }

    /**
    * @dev Remove contract from watch list
    */
    function removeContract(address contractAddress) public onlyValidMembers {
        ContractRemoved(msg.sender,contractAddress);
    }

    /**
    *@dev removes a member who exceeds the cap
    */
    function banMember (address member, string evidence) public onlyValidMembers {
        require(isMember(member));
        require(!complained[msg.sender][member]);
        complained[msg.sender][member] = true;
        complaint[member] += 1;	
        if (complaint[member] >= banThreshold) { 
            removeMember(member);
            if (!isMember(member)) {
                Banned(evidence);
            } 
        } else {
            BanAttempt(msg.sender, member, complaint[member]);
        }
    }

    /**
    * @dev update ban threshold
    */
    function updateBanThreshold (uint threshold) public onlymanymembers(keccak256(threshold)) {
        banThreshold = threshold;
    }

    /**
    * @dev set total allowed upload
    *
    **/
    function setTotalPersistLimit (uint limit) public onlymanymembers(keccak256(limit)) {
        sizeLimit = limit;
        PersistLimitChanged(limit);
    }
}
