import { CheckIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { VotingPowerToken } from "@voting-power/sdk";
import { ReactElement, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useSetDelegateTransaction } from "../../delegate";

export const DelegateDialog = ({ trigger, token }: { trigger: ReactElement; token: VotingPowerToken }) => {
  const [newDelegate, setNewDelegate] = useState<string>("");
  const debouncedNewDelegate = useDebounce(newDelegate, 500);

  const { isOpen, onOpen, onClose } = useDisclosure({ onClose: () => setNewDelegate("") });
  const initialFocusRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { error, isError, isLoading, submit } = useSetDelegateTransaction({ token, newDelegate: debouncedNewDelegate });

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={true}
      initialFocusRef={initialFocusRef}
      placement="top"
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent bgColor={"gray.900"}>
          <PopoverArrow bgColor={"gray.900"} />
          <PopoverCloseButton />
          <PopoverBody p={4}>
            <FormControl
              as="form"
              isInvalid={isError}
              onSubmit={(e) => {
                e.preventDefault();
                submit?.();
                onClose();
              }}
            >
              <FormLabel>Delegate to</FormLabel>
              <HStack spacing={4} alignItems={"end"}>
                <Input
                  type="text"
                  placeholder="Address or ENS"
                  value={newDelegate}
                  onChange={(e) => setNewDelegate(e.target.value)}
                  ref={initialFocusRef}
                />
                <IconButton
                  aria-label={"Confirm"}
                  colorScheme="purple"
                  size={"md"}
                  disabled={!submit}
                  isLoading={isLoading}
                  type="submit"
                  icon={<CheckIcon></CheckIcon>}
                />
              </HStack>

              {error && <FormErrorMessage>Error: {error?.message}</FormErrorMessage>}
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
