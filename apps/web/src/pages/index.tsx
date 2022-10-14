import { Center, Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { supportedTokens } from "@voting-power/sdk";
import { ConnectKitButton } from "connectkit";
import { Suspense } from "react";
import { useAccount } from "../blockchain";
import { TokenCard } from "../components/TokenCard";

export default function IndexPage() {
  const account = useAccount();

  if (!account.address) {
    return (
      <Center w={"full"} h="100vh">
        <Stack align={"center"} spacing={6}>
          <Heading as="h2" size="xl">
            ⚡️Voting Power
          </Heading>
          <Text color={"gray.400"}>Connect your wallet to see your voting power tokens.</Text>
          <ConnectKitButton />
        </Stack>
      </Center>
    );
  }

  return (
    <Stack as={Container} maxW={"5xl"} p="6" spacing={8}>
      <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
        <Heading fontSize={"2xl"}>⚡️Voting Power</Heading>
        <ConnectKitButton />
      </Stack>

      <SimpleGrid columns={{ base: 1 }} spacing={6} alignItems="start">
        <Suspense fallback={null}>
          {supportedTokens.map((token, key) => (
            <TokenCard key={key} token={token}></TokenCard>
          ))}
        </Suspense>
      </SimpleGrid>
    </Stack>
  );
}
