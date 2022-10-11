import { Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { VotingPowerToken } from "@danizord/voting-power-tokens-sdk";
import { useAccount } from "../../blockchain";
import { useDelegate, useVotesToDelegate, useVotingPower } from "../../hooks";

export function VotingPower({ token }: { token: VotingPowerToken }) {
  const account = useAccount();
  const { data: votingPower } = useVotingPower(token);
  const {
    data: { isDelegated, delegate },
  } = useDelegate(token);
  const { data: votesToDelegate } = useVotesToDelegate(token, account.address);

  return (
    <Stack spacing={2} textAlign="center">
      <Stat>
        <StatLabel fontSize={"md"}>Voting Power</StatLabel>
        <StatNumber fontSize={"6xl"} mt={4} rounded="xl" p={1} borderWidth={"thin"}>
          {isDelegated && 0 === votingPower ? votesToDelegate : votingPower}
        </StatNumber>
      </Stat>
    </Stack>
  );
}
