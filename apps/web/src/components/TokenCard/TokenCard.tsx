import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { VotingPowerToken } from "@danizord/voting-power-tokens-sdk";
import { useAccount } from "../../blockchain";
import { useDelegate, useVotesToDelegate, useVotingPower } from "../../hooks";
import { DalegatedAlert } from "./DelegatedAlert";
import { Delegators } from "./Delegators";
import { VotingPower } from "./VotingPower";

export function TokenCard({ token }: { token: VotingPowerToken }) {
  const account = useAccount();
  const delegate = useDelegate(token);
  const votingPower = useVotingPower(token);
  const votesToDelegate = useVotesToDelegate(token, account.address!);

  if (0 === votingPower.data && 0 === votesToDelegate.data) {
    return null;
  }

  return (
    <Box p={6} rounded="xl" backgroundColor={"whiteAlpha.50"}>
      <HStack spacing={8} align="start">
        <Stack spacing={6}>
          <Image src={token.image} height="48" alt={`${token.name} Voting Power Token`} rounded="xl" />
        </Stack>

        <Stack spacing={6} flex="1">
          <HStack justify={"space-between"} align="start">
            <Heading size={"lg"}>{token.name}</Heading>
          </HStack>

          <Stack spacing={4}>
            <Box>
              <Text>{token.sourceDescription}</Text>
              <Text>{token.votingPowerDescription}</Text>
            </Box>

            {delegate.data!.isDelegated && votingPower.data! === 0 && (
              <DalegatedAlert token={token} delegate={delegate.data!.delegate} />
            )}

            <Delegators token={token} />
          </Stack>
        </Stack>

        <Stack spacing={6}>
          <VotingPower token={token}></VotingPower>
          <Link href={token.voteUrl}>
            <Button width={"full"} rightIcon={<ExternalLinkIcon />}>
              Vote
            </Button>
          </Link>
        </Stack>
      </HStack>
    </Box>
  );
}
