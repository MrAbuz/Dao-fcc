// SPDX-License-Identifier: MIT

// We're gonna create a normal ERC-20 token and then extend it to be a governance token aswell

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() ERC20("GovernanceToken", "GT") ERC20Permit("GovernanceToken") {
        _mint(msg.sender, s_maxSupply);
    }

    // Imagine, someone knows a hot proposal is coming up, so they just buy a ton of tokens, and then they dump it right after.
    // We wanna avoid this, so what we do is we create a snapshot of how many tokens people have at a certain block. Once a proposal hits, we pick a snapshot from the past
    // So we're now using ERC20Votes.sol instead of ERC20.sol. It has functions for snapshot, to delegate tokens to different people, to see how many votes somebody has etc..
    // It has all this functions that make this token a much better voting tool

    // The functions below are overrides required by solidity:

    // The reasoning for this functions is that anytime we transfer a token, we wanna make sure that we call the afterTokenTransfer of the ERC20Votes, to make sure that the
    // snapshots are updated. We wanna make sure we know how many votes each people has at each checkpoint (snapshot). Same thing for the mint and burn.
    // From my search, "super" keyword makes us able to use the functions from an inherited contract that we just overriden, but with super we can still use the original functions even
    // tho they were overriden. My understanding that might be wrong is that we specify we're overriding ERC20Votes so that the super is called on ERC20Votes which is what we want,
    // but ERC20 also has a _afterTokenTransfer() so its probably overriding from it aswell and we want this to be called after the transfer so the one from ERC20 has to be overriden,
    // but we probably specify to ERC20Votes so that the smart contract knows to direct the super to the ERC20Votes _afterTokenTransfer() even tho it overrides both. My understanding.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
