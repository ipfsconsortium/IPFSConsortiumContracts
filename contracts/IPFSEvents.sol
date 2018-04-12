pragma solidity ^0.4.19;


contract IPFSEvents {
    event HashAdded(string hash, uint ttl);
    event HashRemoved(string hash);

    event MetadataObjectAdded(string hash);
    event MetadataObjectRemoved(string hash);    
}
