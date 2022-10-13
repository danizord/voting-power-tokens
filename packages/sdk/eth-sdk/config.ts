import { defineConfig } from "@dethcrypto/eth-sdk";

export const config = {
  contracts: {
    mainnet: {
      nouns: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
      nounsPropHouse: "0xef11d1c2aa48826d4c41e54ab82d1ff5ad8a64ca",
      lilNouns: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
      lilNounsPropHouse: "0x39dd11c243ac4ac250980fa3aea016f73c509f37",
    },
  },
};

export default defineConfig(config);
