// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

//ImageStorage deployed to: 0x7dD20bf5793a92d07295C1e8995C8783AE953FaB

contract ImageStorage {
    string private imageHash;

    // Function to store the IPFS hash of the image
    function setImageHash(string memory _imageHash) public {
        imageHash = _imageHash;
    }

    // Function to retrieve the IPFS hash of the image
    function getImageHash() public view returns (string memory) {
        return imageHash;
    }
}
