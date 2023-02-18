// This is the contract that will actually be the owner, that will own everything. The owner of the box contract.

// When we propose or queue a proposal, we want to wait for a new vote to be "executed"
// Imagine the proposal is bad: Everyone who holds the governance token has to pay 5 tokens, nobody would want that probably
// All this governance contracts give time for users to "get out" if they dont like a governance update
// We always want to have some type of timelock and this is what this contract does.

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay: How long you have to wait before executing
    // Proposers: List of addresses that can propose (Here it will be everybody)
    // Executors: Who can execute when a proposal passes (Here it will be everybody)

    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
