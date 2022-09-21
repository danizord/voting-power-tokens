// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "nouns/NounsToken.sol";
import "nouns/base/ERC721Checkpointable.sol";
import "./INounsVotes.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ScopeToken is INounsVotes {
    using EnumerableSet for EnumerableSet.AddressSet;

    INounsVotes nounsToken;

    mapping(address => address) private _delegates;
    mapping(address => EnumerableSet.AddressSet) private _delegators;

    constructor(INounsVotes _nounsToken) {
        nounsToken = _nounsToken;
    }

    /**
     * @notice Delegate scope from `msg.sender` to `delegatee`
     * @param delegatee The address to delegate scope to
     */
    function delegate(address delegatee) public {
        address delegator = msg.sender;
        address currentDelegate = delegates(delegator);

        if (delegatee == msg.sender) {
            // Remove scope delegation
            delegatee = address(0);
        }

        _delegates[delegator] = delegatee;

        if (address(0) != currentDelegate) {
            _delegators[currentDelegate].remove(delegator);
        }

        _delegators[delegatee].add(delegator);

        // @todo: emit DelegateChanged(delegator, currentDelegate, delegatee);
    }

    function delegates(address delegator) public view returns (address) {
        address current = _delegates[delegator];

        return current == address(0) ? nounsToken.delegates(delegator) : current;
    }

    function getCurrentVotes(address account) external view returns (uint96) {
        if (_delegates[account] != address(0)) {
            // Voting power was delegated to someone else
            return 0;
        }

        // Inherit voting power from Nouns token
        uint96 totalVotes = nounsToken.getCurrentVotes(account);

        // Add voting power from other scope delegators
        for (uint8 i = 0; i < _delegators[account].length(); i++) {
            address delegator = _delegators[account].at(i);
            totalVotes += nounsToken.getCurrentVotes(delegator);
        }

        return totalVotes;
    }

    /**
     * @notice Determine the prior voting power on this scope for an account as of a block number
     * @param account The address of the account to check
     * @param blockNumber The block number to get the voting power at
     * @return The number of votes the account had on this scope as of the given block
     */
    //function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);
}
