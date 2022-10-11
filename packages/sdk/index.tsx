import { getMainnetSdk } from ".dethcrypto/eth-sdk-client";
import { ethers } from "ethers";

export { default as abi } from "./eth-sdk/abis/mainnet/nounsPropHouse.json";
export { supportedTokens } from "./supportedTokens";

export interface VotingPowerToken {
  name: string;
  image: string;
  voteUrl: string;
  source?: VotingPowerToken;
  sourceDescription: string;
  votingPowerDescription: string;
  contractAddress: string;
  getContract: (provider: ethers.providers.Provider) => VotingPowerContract;
}

type VotingPowerContract = ReturnType<typeof getMainnetSdk>["nounsPropHouse"];

export const getContracts = (provider: ethers.providers.Provider) => {
  return getMainnetSdk(provider);
};
