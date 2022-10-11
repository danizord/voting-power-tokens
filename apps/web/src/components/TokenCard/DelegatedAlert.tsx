import { Alert, AlertDescription, AlertIcon, Button } from "@chakra-ui/react";
import { useEnsName } from "wagmi";

export function DalegatedAlert({ delegate }: { delegate: string }) {
  const ensName = useEnsName({ address: delegate });

  return (
    <Alert status="info" rounded={"lg"}>
      <AlertIcon />
      <AlertDescription flex="1"> Delegated to {ensName.data ?? delegate}</AlertDescription>

      <Button size={"md"}>Change</Button>
    </Alert>
  );
}
