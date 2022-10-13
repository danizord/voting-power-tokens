import { ConnectKitProvider } from "connectkit";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { WagmiConfig } from "wagmi";
import { client } from "../blockchain";
import { theme } from "../theme";

// Chakra uses emotion under the hood, which does not play well with SSR in SWC,
// as it causes https://nextjs.org/docs/messages/react-hydration-error,
// which requires switching to babel to fix, but Babel is slow.
// And we don't really care about SSR here, so let's disable it:
const ChakraProvider = dynamic(async () => (await import("@chakra-ui/react")).ChakraProvider, { ssr: false });

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto" mode="dark">
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
