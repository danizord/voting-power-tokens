import { Alert, AlertDescription, AlertIcon, Button } from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
import type { Address } from "wagmi";
import { useEnsName } from "wagmi";
import { DelegateDialog } from "./DelegateDialog";

export function DalegatedAlert({ delegate, token }: { delegate: Address; token: VotingPowerToken }) {
  const ensName = useEnsName({ address: delegate });

  return (
    <Alert status="info" rounded={"lg"}>
      <AlertIcon />
      <AlertDescription flex="1"> Delegated to {ensName.data ?? delegate}</AlertDescription>
      <DelegateDialog token={token} trigger={<Button size={"md"}>Change</Button>} />
    </Alert>
  );
}
