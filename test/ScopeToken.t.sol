// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ScopeToken.sol";

contract ScopeTokenTest is Test {
    ScopeToken public scope;

    function setUp() public {
       scope = new ScopeToken();
       scope.setNumber(0);
    }

    function testIncrement() public {
        scope.increment();
        assertEq(scope.number(), 1);
    }

    function testSetNumber(uint256 x) public {
        scope.setNumber(x);
        assertEq(scope.number(), x);
    }
}
