import { EditIcon } from "@chakra-ui/icons";
import { Button, HStack, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { abi, VotingPowerToken } from "@danizord/voting-power-tokens-sdk";
import { flat, sort } from "radash";
import { match } from "ts-pattern";
import { Address, useContractEvent, useEnsName, useQuery } from "wagmi";
import { client, useAccount } from "../../blockchain";
import { useVotesToDelegate, useVotingPower } from "../../hooks";
import { DelegateDialog } from "./DelegateDialog";

const getDelegators = async (token: VotingPowerToken, account: string) => {
  const source = token.source?.getContract(client.provider);
  const derivative = token.getContract(client.provider);

  // Fetch in parallel all DelegateChanged events "to" and "from" account, in both source and derivative contracts
  let aggregatedEvents = flat(
    await Promise.all([
      ...(source ? [source.queryFilter(source.filters.DelegateChanged(null, null, account))] : []),
      ...(source ? [source.queryFilter(source.filters.DelegateChanged(null, account, null))] : []),
      ...[derivative.queryFilter(derivative.filters.DelegateChanged(null, null, account))],
      ...[derivative.queryFilter(derivative.filters.DelegateChanged(null, account, null))],
    ])
  );

  // Remove self-delegation events;
  aggregatedEvents = aggregatedEvents.filter((e) => e.args.delegator !== account);

  // Sort by block number
  aggregatedEvents = sort(aggregatedEvents, (e) => e.blockNumber);

  const delegators = aggregatedEvents.reduce((state, event) => {
    match(event.args)
      .when(
        (e) => e.toDelegate === account,
        () => state.add(event.args.delegator as Address)
      )
      .when(
        (e) => e.fromDelegate === account,
        () => state.delete(event.args.delegator as Address)
      )
      .run();

    return state;
  }, new Set<Address>());

  return delegators;
};

export const Delegators = ({ token }: { token: VotingPowerToken }) => {
  const account = useAccount();
  const votingPower = useVotingPower(token);
  const delegators = useQuery(["delegators", token.contractAddress, account.address], {
    queryFn: () => getDelegators(token, account.address!),
    suspense: true,
  });

  // Refetch delegators whenever DelegatorChanged occurs
  useContractEvent({
    address: token.contractAddress,
    abi: abi,
    eventName: "DelegateChanged",
    listener: () => delegators.refetch(),
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
            <DelegatorRow delegator={account.address!} token={token} />
            {Array.from(delegators.data!).map((delegator) => (
              <DelegatorRow key={delegator} token={token} delegator={delegator} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

const DelegatorRow = ({ token, delegator }: { token: VotingPowerToken; delegator: Address }) => {
  const account = useAccount();
  const ensName = useEnsName({ address: delegator });
  const delegatorVotes = useVotesToDelegate(token, delegator);

  return (
    <Tr hidden={delegatorVotes.isSuccess && 0 === delegatorVotes.data}>
      <Td isNumeric>{delegatorVotes.data}</Td>
      <Td>
        <HStack justify={"space-between"}>
          <Text>{ensName.data ?? delegator}</Text>
          {delegator === account.address && (
            <DelegateDialog
              token={token}
              trigger={
                <Button size={"sm"} rightIcon={<EditIcon />}>
                  Delegate
                </Button>
              }
            />
          )}
        </HStack>
      </Td>
    </Tr>
  );
};
