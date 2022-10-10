// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.6;

/**
 * @dev This is a subset of ERC721Checkpointable that excludes getPriorVotes()
 * VotingPower can't implement getPriorVotes() because it uses source token balance
 * to determine the delegated amount, which is not stored in past checkpoints.
 *
 * https://github.com/nounsDAO/nouns-monorepo/blob/1.0.0/packages/nouns-contracts/contracts/base/ERC721Checkpointable.sol
 */
interface IVotingPower {
    /**
     * @notice The votes a delegator can delegate.
     */
    function votesToDelegate(address delegator) external view returns (uint96);

    /**
     * @notice Overrides the standard `Comp.sol` delegates mapping to return
     * the delegator's own address if they haven't delegated.
     * This avoids having to delegate to oneself.
     */
    function delegates(address delegator) external view returns (address);

    /**
     * @notice Delegate votes from `msg.sender` to `delegatee`
     * @param delegatee The address to delegate votes to
     */
    function delegate(address delegatee) external;

    /**
     * @notice Gets the current voting power for `account`
     * @param account The address to get voting power
     * @return The number of current votes for `account`
     */
    function getCurrentVotes(address account) external view returns (uint96);
}
