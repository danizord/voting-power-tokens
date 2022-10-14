import { getMainnetSdk } from ".dethcrypto/eth-sdk-client";
import { ethers } from "ethers";
import { config } from "../eth-sdk/config";
import { VotingPowerToken } from "./index";

const nounsDaoGovernance: VotingPowerToken = {
  name: "NounsDAO",
  image: "https://i.imgur.com/seB1iJo.png",
  voteUrl: "https://nouns.wtf/vote",
  sourceDescription: "Derivates from Nouns NFT balance.",
  votingPowerDescription: "Each Noun is entitled to 1 vote per proposal in the Nouns DAO governance.",
  contractAddress: config.contracts.mainnet.nouns,
  getContract: (provider: ethers.providers.Provider) => getMainnetSdk(provider).nouns,
};

const nounsPropHouse: VotingPowerToken = {
  name: "Nouns Prop House",
  image: "https://i.imgur.com/seB1iJo.png",
  voteUrl: "https://prop.house/nouns",
  source: nounsDaoGovernance,
  sourceDescription: "Derivates from Nouns DAO Governance voting power.",
  votingPowerDescription: "Each Noun is entitled 10 votes per founding round.",
  contractAddress: config.contracts.mainnet.nounsPropHouse,
  getContract: (provider: ethers.providers.Provider) => getMainnetSdk(provider).nounsPropHouse,
};

const lilNounsGovernance: VotingPowerToken = {
  name: "Lil Nouns",
  image: "https://i.imgur.com/h7rmEOX.png",
  voteUrl: "https://lilnouns.wtf/vote",
  sourceDescription: "Derivates from Lil Nouns NFT balance.",
  votingPowerDescription: "Each Lil Noun is entitled to 1 vote in Lil Nouns DAO governance proposals.",
  contractAddress: config.contracts.mainnet.lilNouns,
  getContract: (provider: ethers.providers.Provider) => getMainnetSdk(provider).lilNouns,
};

const lilNounsPropHouse: VotingPowerToken = {
  name: "Lil Nouns Prop House",
  image: "https://i.imgur.com/h7rmEOX.png",
  voteUrl: "https://prop.house/lil-nouns",
  source: lilNounsGovernance,
  sourceDescription: "Derivates from Lil Nouns DAO Governance voting power.",
  votingPowerDescription: "Each Lil Noun is entitled to 1 vote per founding round.",
  contractAddress: config.contracts.mainnet.lilNounsPropHouse,
  getContract: (provider: ethers.providers.Provider) => getMainnetSdk(provider).lilNounsPropHouse,
};

export const supportedTokens: VotingPowerToken[] = [
  // nounsDaoGovernance,
  nounsPropHouse,
  // lilNounsGovernance,
  lilNounsPropHouse,
];
