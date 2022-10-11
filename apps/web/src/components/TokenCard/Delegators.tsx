import { Button, HStack, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { VotingPowerToken } from "@danizord/voting-power-tokens-sdk";

import { sort } from "radash";
import { match } from "ts-pattern";
import { useEnsName, useQuery } from "wagmi";
import { client, useAccount } from "../../blockchain";
import { useVotesToDelegate, useVotingPower } from "../../hooks";

const getDelegators = async (token: VotingPowerToken, account: string) => {
  const source = token.source?.getContract(client.provider);
  const derivative = token.getContract(client.provider);

  const aggregatedEvents = sort(
    [
      ...(source ? await source.queryFilter(source.filters.DelegateChanged(null, null, account)) : []), //
      ...(source ? await source.queryFilter(source.filters.DelegateChanged(null, account, null)) : []),
      ...(await derivative.queryFilter(derivative.filters.DelegateChanged(null, null, account))), //
      ...(await derivative.queryFilter(derivative.filters.DelegateChanged(null, account, null))),
    ],
    (e) => e.blockNumber
  );

  const delegators = aggregatedEvents.reduce((state, event) => {
    match(event.args)
      .when(
        (e) => e.toDelegate === account,
        () => state.add(event.args.delegator)
      )
      .when(
        (e) => e.fromDelegate === account,
        () => state.delete(event.args.delegator)
      )
      .run();

    return state;
  }, new Set<string>());

  return delegators;
};

export const Delegators = ({ token }: { token: VotingPowerToken }) => {
  const account = useAccount();
  const votingPower = useVotingPower(token);
  const delegators = useQuery(["delegators", token.contractAddress, account.address], () => {
    return getDelegators(token, account.address);
  });

  if (votingPower.isSuccess && votingPower.data === 0) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {/* <Heading fontSize={"lg"}>Delegators</Heading> */}

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th isNumeric>Votes</Th>
              <Th width={"full"}>Delegator</Th>
            </Tr>
          </Thead>
          <Tbody>
            <DelegatorRow delegator={account.address} token={token} />
            {Array.from(delegators.data ?? new Set()).map((delegator) => (
              <DelegatorRow key={delegator} token={token} delegator={delegator} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

const DelegatorRow = ({ token, delegator }: { token: VotingPowerToken; delegator: string }) => {
  const account = useAccount();
  const ensName = useEnsName({ address: delegator });
  const delegatorVotes = useVotesToDelegate(token, delegator);

  return (
    <Tr hidden={delegatorVotes.isSuccess && 0 === delegatorVotes.data}>
      <Td isNumeric>{delegatorVotes.data}</Td>
      <Td>
        <HStack justify={"space-between"}>
          <Text>{ensName.data ?? delegator}</Text>
          {delegator === account.address && <Button size={"sm"}>Delegate</Button>}
        </HStack>
      </Td>
    </Tr>
  );
};
