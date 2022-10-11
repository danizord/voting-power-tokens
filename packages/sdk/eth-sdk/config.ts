import { defineConfig } from "@dethcrypto/eth-sdk";

export const config = {
  contracts: {
    mainnet: {
      nouns: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
      nounsPropHouse: "0x74Df809b1dfC099E8cdBc98f6a8D1F5c2C3f66f8",
      lilNouns: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
      lilNounsPropHouse: "0xeC827421505972a2AE9C320302d3573B42363C26",
    },
  },
};

export default defineConfig(config);
