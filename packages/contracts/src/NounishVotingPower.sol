// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./IVotingPower.sol";

contract NounishVotingPower is IVotingPower {
    using EnumerableSet for EnumerableSet.AddressSet;

    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    IVotingPower private source;

    uint96 multiplier;

    EnumerableSet.AddressSet private delegators;

    mapping(address => address) private _delegates;

    constructor(IVotingPower _source, uint96 _multiplier) {
        source = _source;
        multiplier = _multiplier;
    }

    function delegate(address delegatee) public {
        address delegator = msg.sender;
        address currentDelegate = _delegates[delegator];

        _delegates[delegator] = delegatee;

        if (address(0) == msg.sender) {
            delegators.remove(delegator);
        } else {
            delegators.add(delegator);
        }

        emit DelegateChanged(delegator, currentDelegate, delegatee);
    }

    function votesToDelegate(address delegator) external view returns (uint96) {
        return source.votesToDelegate(delegator) * multiplier;
    }

    function delegates(address delegator) external view returns (address) {
        if (address(0) == _delegates[delegator]) {
            return source.delegates(delegator);
        }

        return _delegates[delegator];
    }

    function getCurrentVotes(address account) public view returns (uint96) {
        uint96 votingPower = source.getCurrentVotes(account) * multiplier;

        for (uint256 i = 0; i < delegators.length(); i++) {
            address delegator = delegators.at(i);

            if (source.delegates(delegator) == account) {
                votingPower -= source.votesToDelegate(delegator);
            }

            if (this.delegates(delegator) == account) {
                votingPower += source.votesToDelegate(delegator);
            }
        }

        return votingPower;
    }
}
