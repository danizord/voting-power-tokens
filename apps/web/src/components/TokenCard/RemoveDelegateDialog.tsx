import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
import { ReactElement } from "react";
import { useSetDelegateTransaction } from "../../delegate";

export const RemoveDelegateDialog = ({ trigger, token }: { trigger: ReactElement; token: VotingPowerToken }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const removeDelegateTx = useSetDelegateTransaction({
    token,
    newDelegate: "0x0000000000000000000000000000000000000000",
  });

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnBlur={true} placement="top">
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent bgColor={"gray.900"}>
          <PopoverArrow bgColor={"gray.900"} />
          <PopoverCloseButton />

          <PopoverHeader fontSize="lg" fontWeight="bold" border={0} p={4}>
            Remove delegation override
          </PopoverHeader>

          {/* Todo: tell which is the default */}
          <PopoverBody px={4}>
            Are you sure? Your delegate will be reset to the default defined in the source {token.source?.name} token.
          </PopoverBody>

          <PopoverFooter as={HStack} border={0} justifyContent="space-between" p={4}>
            <Button onClick={onClose}>Cancel</Button>

            <Button
              colorScheme="red"
              onClick={() => {
                removeDelegateTx.submit?.();
                onClose();
              }}
              ml={3}
            >
              Remove
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
