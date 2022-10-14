import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
import { useAccount } from "../../blockchain";
import { useDelegate, useVotesToDelegate, useVotingPower } from "../../hooks";

export function VotingPower({ token }: { token: VotingPowerToken }) {
  const account = useAccount();
  const { data: votingPower } = useVotingPower(token);
  const {
    data: { isDelegated, delegate },
  } = useDelegate(token);
  const { data: votesToDelegate } = useVotesToDelegate(token, account.address!);

  return (
    <Stat rounded="xl" pb={2} px={4} pt={1} borderWidth={"thin"} maxW={"fit-content"} textAlign={"center"}>
      <StatNumber fontSize={"6xl"} lineHeight="shorter">
        {isDelegated && 0 === votingPower ? votesToDelegate : votingPower}
      </StatNumber>
      <StatLabel fontSize={"sm"}>Voting Power</StatLabel>
    </Stat>
  );
}
