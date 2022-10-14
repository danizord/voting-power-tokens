import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
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
    <HStack p={6} rounded="xl" backgroundColor={"whiteAlpha.100"} spacing={8} align="start">
      <Image src={token.image} height="200px" alt={`${token.name} Voting Power Token`} rounded="xl" />

      <Stack spacing={delegate.data.isDelegated ? 6 : 4} flex="1">
        <HStack align={"start"} spacing={6}>
          <Stack spacing={6} flex="1">
            <HStack spacing={4} alignItems={"end"}>
              <Heading size={"lg"}>{token.name}</Heading>

              {votingPower.data !== 0 && (
                <Button
                  as={"a"}
                  size={"sm"}
                  href={token.voteUrl}
                  target="_blank"
                  colorScheme="purple"
                  rightIcon={<ExternalLinkIcon />}
                >
                  Vote
                </Button>
              )}
            </HStack>

            <Box>
              <Text>{token.sourceDescription}</Text>
              <Text>{token.votingPowerDescription}</Text>
            </Box>
          </Stack>

          <VotingPower token={token}></VotingPower>
        </HStack>

        {delegate.data!.isDelegated && votingPower.data! === 0 && (
          <DalegatedAlert token={token} delegate={delegate.data!.delegate} />
        )}

        <Delegators token={token} />
      </Stack>
    </HStack>
  );
}
