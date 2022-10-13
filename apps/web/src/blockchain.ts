import { chain, configureChains, createClient, useAccount as useAccount_ } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { provider, webSocketProvider, chains } = configureChains(
  [{ ...chain.foundry, ens: chain.mainnet.ens, multicall: chain.mainnet.multicall }],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: "http://localhost:8545" };
      },
    }),
  ]
);

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [new MetaMaskConnector({ chains })],
});

export const useAccount = () => {
  return useAccount_();

  // return {
  // address: "0x2573c60a6d127755aa2dc85e342f7da2378a0cc5", // nounders
  // address: "0xcC2688350d29623E2A0844Cc8885F9050F0f6Ed5", // nouncil
  // address: "0x75Ee6eb3d8DAcf41eE2e5307090B197D3E1Cca6E", // noun 22 (delegate)
  // address: "0x177751396D8236569C5C7B04232C7b7281a3B9f3", // seneca (delegator)
  // address: "0xaa55b756Cc30EebB2728Fe5d43d334625e0A0b4c", // danizord (self-delegator)
  // address: "0xD19BF5F0B785c6f1F6228C72A8A31C9f383a49c4", // cdt (empty)
  // };
};
