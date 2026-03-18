// SPDX-License-Identifier : MIT

pragma solidity ^0.8.20;

contract Vault {
    mapping(address => uint256) public balances;

    function depositMain() external payable {
        balances[msg.sender] += msg.value;
    }
}