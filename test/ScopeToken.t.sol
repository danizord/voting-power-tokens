// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ScopeToken.sol";

contract ScopeTokenTest is Test {
    address public NOUNS = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;
    address public LIL_NOUNS = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address public HOLDER = 0xaa55b756Cc30EebB2728Fe5d43d334625e0A0b4c;

    ScopeToken public scope;

    function setUp() public {
       scope = new ScopeToken(INounsVotes(LIL_NOUNS));
    }

    function testFallbackToUnderlyingNounsDelegationByDefault() public {
        assertEq(1, scope.getCurrentVotes(HOLDER));
        assertEq(HOLDER, scope.delegates(HOLDER));
    }

    function testDelegate() public {
        address a = HOLDER;
        address b = address(1);

        vm.prank(a);
        scope.delegate(b);

        assertEq(scope.getCurrentVotes(a), 0);
        assertEq(scope.getCurrentVotes(b), 1);
        assertEq(scope.delegates(a), b);
    }

    function testRemoveDelegation() public {
        address a = HOLDER;
        address b = address(1);

        vm.prank(a);
        scope.delegate(b);

        vm.prank(a);
        scope.delegate(address(0));

        assertEq(scope.getCurrentVotes(a), 1);
        assertEq(scope.getCurrentVotes(b), 0);
        assertEq(scope.delegates(a), a);
    }

    function testChangeDelegation() public {
        address a = HOLDER;
        address b = address(1);
        address c = address(2);

        vm.startPrank(a);
            scope.delegate(b);
            scope.delegate(c);
        vm.stopPrank();

        assertEq(scope.getCurrentVotes(a), 0);
        assertEq(scope.getCurrentVotes(b), 0);
        assertEq(scope.getCurrentVotes(c), 1);

        assertEq(scope.delegates(a), c);
    }

    function testSelfDelegate() public {
        vm.prank(HOLDER);
        scope.delegate(HOLDER);

        assertEq(scope.getCurrentVotes(HOLDER), 1);
    }
}
