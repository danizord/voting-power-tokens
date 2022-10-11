import { ChakraProvider } from "@chakra-ui/react";
import { ConnectKitProvider } from "connectkit";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { client } from "../blockchain";
import { theme } from "../theme";

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
