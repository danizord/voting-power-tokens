import { providers } from "ethers";
import { chain, configureChains, createClient, useAccount as useAccount_ } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Configure local fork chain
const { provider, webSocketProvider, chains } = configureChains(
  [
    {
      id: 31338,
      name: "VotingPower Forked Mainnet",
      network: "votingpower",
      nativeCurrency: {
        name: "ForkedEther",
        symbol: "FakETH",
        decimals: 18,
      },
      rpcUrls: {
        default: "https://1d7c-2a09-bac0-97-00-824-d90c.ngrok.io",
      },
      blockExplorers: chain.mainnet.blockExplorers,
      ens: chain.mainnet.ens,
      multicall: chain.mainnet.multicall,
      testnet: true,
    },
  ],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default, ws: chain.rpcUrls.default }) })]
);

// Override connector getSigner to add ENS resolver support
const metamaskConnector = new MetaMaskConnector({ chains });
metamaskConnector.getSigner = async ({ chainId }: { chainId?: number } = {}) => {
  const [provider, account] = await Promise.all([metamaskConnector.getProvider(), metamaskConnector.getAccount()]);

  const chain = metamaskConnector.chains.find((x) => x.id === chainId);

  return new providers.Web3Provider(
    <providers.ExternalProvider>provider,
    chain
      ? {
          chainId: chain.id,
          name: chain.name,
          ensAddress: chain.ens?.address,
        }
      : chainId
  ).getSigner(account);
};

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: { qrcode: false },
});

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [metamaskConnector, walletConnectConnector],
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
