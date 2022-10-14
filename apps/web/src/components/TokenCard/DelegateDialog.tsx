import { CheckIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormHelperText,
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
import { abi, VotingPowerToken } from "@voting-power/sdk";
import { ReactElement, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export const DelegateDialog = ({ trigger, token }: { trigger: ReactElement; token: VotingPowerToken }) => {
  const [delegateTo, setDelegateTo] = useState<string>("");
  const debouncedDelegateTo = useDebounce(delegateTo, 500);

  const { isOpen, onOpen, onClose } = useDisclosure({ onClose: () => setDelegateTo("") });
  const initialFocusRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    abi: abi,
    address: token.contractAddress,
    functionName: "delegate",
    args: [debouncedDelegateTo as Address],
    enabled: Boolean(debouncedDelegateTo),
  });
  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({ hash: data?.hash, onSuccess: () => onClose() });

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
        <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody py={4}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                write?.();
              }}
            >
              <HStack spacing={2} alignItems={"end"}>
                <FormControl>
                  <FormLabel>Delegate to</FormLabel>
                  <Input
                    type="text"
                    placeholder="Address or ENS"
                    value={delegateTo}
                    onChange={(e) => setDelegateTo(e.target.value)}
                    ref={initialFocusRef}
                  />

                  {(isPrepareError || isError) && (
                    <FormHelperText>Error: {(prepareError ?? error)?.message}</FormHelperText>
                  )}
                </FormControl>
                <IconButton
                  aria-label={"Confirm"}
                  colorScheme="teal"
                  disabled={!write}
                  isLoading={isLoading}
                  type="submit"
                  icon={<CheckIcon></CheckIcon>}
                />
              </HStack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
