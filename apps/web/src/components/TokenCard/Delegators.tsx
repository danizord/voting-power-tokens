import { EditIcon } from "@chakra-ui/icons";
import { Button, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { abi, getDelegators, VotingPowerToken } from "@voting-power/sdk";
import { Address, useContractEvent, useEnsName, useQuery } from "wagmi";
import { client, useAccount } from "../../blockchain";
import { useVotesToDelegate, useVotingPower } from "../../hooks";
import { DelegateDialog } from "./DelegateDialog";

export const Delegators = ({ token }: { token: VotingPowerToken }) => {
  const account = useAccount();
  const votingPower = useVotingPower(token);
  const delegators = useQuery(["delegators", token.contractAddress, account.address], {
    queryFn: () => getDelegators({ token, account: account.address!, provider: client.provider }),
    suspense: true,
  });

  // Refetch delegators whenever DelegatorChanged occurs
  useContractEvent({
    address: token.contractAddress,
    abi: abi,
    eventName: "DelegateChanged",
    listener: () => delegators.refetch(),
  });

  if (votingPower.data === 0) {
    return null;
  }

  return (
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
