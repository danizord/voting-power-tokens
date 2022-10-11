import { Container, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { supportedTokens } from "@danizord/voting-power-tokens-sdk";
import { ConnectKitButton } from "connectkit";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useAccount } from "../blockchain";

const TokenCard = dynamic(
  async () => {
    return (await import("../components/TokenCard")).TokenCard;
  },
  { ssr: false }
);

export default function IndexPage() {
  const account = useAccount();

  return (
    <>
      <Stack as={Container} maxW={"5xl"} p="6" spacing={8}>
        <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
          <Heading fontSize={"2xl"}>⚡️Voting Power Tokens</Heading>
          <ConnectKitButton />
        </Stack>

        {account.address && (
          <SimpleGrid columns={{ base: 1 }} spacing={6} alignItems="start">
            <Suspense fallback={null}>
              {supportedTokens.map((token, key) => (
                <TokenCard key={key} token={token}></TokenCard>
              ))}
            </Suspense>
          </SimpleGrid>
        )}
      </Stack>
    </>
  );
}
