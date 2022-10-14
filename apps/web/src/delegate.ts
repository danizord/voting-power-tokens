import { abi, VotingPowerToken } from "@voting-power/sdk";
import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export const useSetDelegateTransaction = ({
  token,
  newDelegate,
}: {
  token: VotingPowerToken;
  newDelegate?: string;
}) => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPrepareLoading,
  } = usePrepareContractWrite({
    abi: abi,
    address: token.contractAddress,
    functionName: "delegate",
    args: newDelegate ? [newDelegate.toLowerCase() as Address] : undefined,
    enabled: Boolean(newDelegate),
  });

  const { data, error: writeError, isError: isWriteError, write } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({ hash: data?.hash });

  return {
    error: prepareError ?? writeError,
    isError: isPrepareError || isWriteError,
    isLoading: isPrepareLoading,
    submit: write,
  };
};
