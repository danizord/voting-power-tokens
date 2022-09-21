// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface INounsVotes {
    // event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    // function checkpoints(address, uint32) external view returns (uint32 fromBlock, uint96 votes);
    function delegate(address delegatee) external;
    // function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external;
    function delegates(address delegator) external view returns (address);

    function getCurrentVotes(address account) external view returns (uint96);
    ///function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);

    // function nonces(address) external view returns (uint256);
    ///function numCheckpoints(address) external view returns (uint32);

    // function votesToDelegate(address delegator) external view returns (uint96);
}
