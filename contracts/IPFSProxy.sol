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

    event ContractAdded(address PubKey, uint ttl);
    event ContractRemoved(address PubKey);
	event Banned(string IPFSHash);
	event BanAttempt(address complainer, address _Member, uint complaints );
	event PersistLimitChanged(uint Limit);	

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
	* @param _IPFSHash The ipfs hash to propagate.
	* @param _ttl amount of time is seconds to persist this. 
	*/
	function addHash(string _IPFSHash, uint _ttl) public onlyValidMembers {
		HashAdded(msg.sender,_IPFSHash,_ttl);
	}

	/**
	* @dev Remove hash from persistent storage
	* @param _IPFSHash The ipfs hash to propagate.	
	*/
	function removeHash(string _IPFSHash) public onlyValidMembers {
		HashRemoved(msg.sender,_IPFSHash);
	}


	/** 
	* Add a contract to watch list. Each node will then 
	* watch it for `HashAdded(msg.sender,_IPFSHash,_ttl);` 
	* events and it will cache these events
	*/

	function addContract(address _toWatch, uint _ttl) public onlyValidMembers {
		ContractAdded(_toWatch, _ttl);
	}

	/**
	* @dev Remove contract from watch list
	*/
	function removeContract(address _contractAddress) public onlyValidMembers {
		ContractRemoved(_contractAddress);
	}

	/**
	*@dev removes a member who exceeds the cap
	*/
	function banMember (address _Member, string _evidence) public onlyValidMembers {
		require(isMember(_Member));
		require(!complained[msg.sender][_Member]);
		complained[msg.sender][_Member] = true;
		complaint[_Member] += 1;	
		if (complaint[_Member] >= banThreshold) { 
			removeMember(_Member);
			if (!isMember(_Member)) {
				Banned(_evidence);
			} 
		} else {
			BanAttempt(msg.sender, _Member, complaint[_Member]);
		}
	}
	/**
	* @dev update ban threshold
	*/
	function updateBanThreshold (uint _banThreshold) public onlymanymembers(keccak256(_banThreshold)) {
		banThreshold = _banThreshold;
	}

	/**
	* @dev set total allowed upload
	*
	**/
	function setTotalPersistLimit (uint _limit) public onlymanymembers(keccak256(_limit)) {
		sizeLimit = _limit;
		PersistLimitChanged(_limit);
	}
}
