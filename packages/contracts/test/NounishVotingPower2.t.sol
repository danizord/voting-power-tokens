// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/NounishVotingPower.sol";
import "../src/IVotingPower.sol";
import "nouns/test/NounsTokenHarness.sol";
import "nouns/NounsDescriptor.sol";
import "nouns/NounsSeeder.sol";
import "nouns/external/opensea/IProxyRegistry.sol";

contract NounishVotingPowerTest is Test {
    NounsTokenHarness public nouns;
    IVotingPower public propHouse;

    function setUp() public {
        nouns = new NounsTokenHarness(
            address(0),
            address(this),
            new NounsDescriptor(),
            new NounsSeeder(),
            IProxyRegistry(address(0))
        );

        propHouse = new NounishVotingPower(IVotingPower(address(nouns)));
    }

    function testCanHaveDifferentDelegatesForNounsAndPropHouse() public {
        address delegator = address(1);
        address delegateA = address(2);
        address delegateB = address(3);

        // Add 1 token 1 delegator
        nouns.mintSeed(delegator, 1, 1, 1, 1, 1);

        vm.startPrank(delegator);

        // Delegate Nouns votes to A
        nouns.delegate(delegateA);

        // Delegate PropHouse votes to B
        propHouse.delegate(delegateB);

        vm.stopPrank();

        assertEq(nouns.getCurrentVotes(delegateA), 1);
        assertEq(nouns.getCurrentVotes(delegateB), 0);

        assertEq(propHouse.getCurrentVotes(delegateA), 0); // <----- Here it would fail returning 1
        assertEq(propHouse.getCurrentVotes(delegateB), 1);
    }
}
