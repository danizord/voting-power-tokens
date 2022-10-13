// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NounishVotingPower.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        // Anvil account 7
        // Hardcoded here so that we always deploy contracts to the same addresses
        vm.startBroadcast(0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356);

        // 0xef11d1c2aa48826d4c41e54ab82d1ff5ad8a64ca
        console.log(address(new NounishVotingPower(IVotingPower(address(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)), 10)));

        // 0x39dd11c243ac4ac250980fa3aea016f73c509f37
        console.log(address(new NounishVotingPower(IVotingPower(address(0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B)), 1)));

        vm.stopBroadcast();
    }
}
