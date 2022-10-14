import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, ButtonGroup, IconButton } from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
import { Address, useEnsName } from "wagmi";
import { DelegateDialog } from "./DelegateDialog";
import { RemoveDelegateDialog } from "./RemoveDelegateDialog";

export function DalegatedAlert({ delegate, token }: { delegate: Address; token: VotingPowerToken }) {
  const ensName = useEnsName({ address: delegate });

  return (
    <Alert status="info" rounded={"lg"}>
      <AlertIcon />
      <AlertDescription flex="1">Delegated to {ensName.data ?? delegate}</AlertDescription>
      <ButtonGroup>
        <RemoveDelegateDialog
          token={token}
          trigger={<IconButton aria-label={"Remove delegate"} size={"md"} type="submit" icon={<DeleteIcon />} />}
        />

        <DelegateDialog
          token={token}
          trigger={<IconButton aria-label={"Change delegate"} size={"md"} type="submit" icon={<EditIcon />} />}
        />
      </ButtonGroup>
    </Alert>
  );
}
