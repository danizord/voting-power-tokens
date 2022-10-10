// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/NounishVotingPower.sol";
import "../src/IVotingPower.sol";

contract NounishVotingPowerTest is Test {
    address public NOUNS = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;
    address public LIL_NOUNS = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address public HOLDER = 0xaa55b756Cc30EebB2728Fe5d43d334625e0A0b4c;

    IVotingPower public source;
    IVotingPower public votingPower;

    function setUp() public {
        source = IVotingPower(LIL_NOUNS);
        votingPower = new NounishVotingPower(source);
    }

    function testFallbackToUnderlyingNounsDelegationByDefault() public {
        assertEq(1, votingPower.getCurrentVotes(HOLDER));
        assertEq(HOLDER, votingPower.delegates(HOLDER));
    }

    function testDelegate() public {
        address a = HOLDER;
        address b = address(1);

        vm.prank(a);
        votingPower.delegate(b);

        assertEq(votingPower.getCurrentVotes(a), 0);
        assertEq(votingPower.getCurrentVotes(b), 1);
        assertEq(votingPower.delegates(a), b);
    }

    function testRemoveDelegation() public {
        address a = HOLDER;
        address b = address(1);

        vm.prank(a);
        votingPower.delegate(b);

        vm.prank(a);
        votingPower.delegate(address(0));

        assertEq(votingPower.getCurrentVotes(a), 1);
        assertEq(votingPower.getCurrentVotes(b), 0);
        assertEq(votingPower.delegates(a), a);
    }

    function testChangeDelegation() public {
        address a = HOLDER;
        address b = address(1);
        address c = address(2);

        vm.startPrank(a);
            votingPower.delegate(b);
            votingPower.delegate(c);
        vm.stopPrank();

        assertEq(votingPower.getCurrentVotes(a), 0);
        assertEq(votingPower.getCurrentVotes(b), 0);
        assertEq(votingPower.getCurrentVotes(c), 1);

        assertEq(votingPower.delegates(a), c);
    }

    function testSelfDelegate() public {
        vm.prank(HOLDER);
        votingPower.delegate(HOLDER);

        assertEq(votingPower.getCurrentVotes(HOLDER), 1);
    }

    function testCanHaveDifferentDelegatesForSourceAndDerivative() public {
        address a = HOLDER;
        address b = address(1);
        address c = address(2);

        vm.startPrank(a);
            source.delegate(b);
            votingPower.delegate(c);
        vm.stopPrank();

        assertEq(source.getCurrentVotes(a), 0);
        assertEq(source.getCurrentVotes(b), 1);
        assertEq(source.getCurrentVotes(c), 0);

        assertEq(votingPower.getCurrentVotes(a), 0);
        assertEq(votingPower.getCurrentVotes(b), 0);
        assertEq(votingPower.getCurrentVotes(c), 1);
    }

    // Test todo list:
    // - Inherits from source by default
    // - Delegate
    // - Change delegate {adds to newDelegate, substracts from oldDelegate}
    // - Remove delegation
    // - Self delegate
    // - Cannot double-delegate to self
    // - Cannot double-delegate to same address
    // - Cannot double-delegate to different addresses
    // - Reflects added delegation from source
    // - Reflects removed delegation from source
    // - Reflects increased balance from source
    // - Reflects decreased balance from source
    // - Review visibility
}
