import { abi, VotingPowerToken } from "@danizord/voting-power-tokens-sdk";

import { useContractRead } from "wagmi";
import { useAccount } from "./blockchain";

export function useVotingPower(token: VotingPowerToken) {
  const account = useAccount();

  return useContractRead({
    address: token.contractAddress,
    abi: abi,
    functionName: "getCurrentVotes",
    args: [account.address],
    select: (value) => value.toNumber(),
    suspense: true,
    watch: true,
  });
}

export const useDelegate = (token: VotingPowerToken) => {
  const account = useAccount();

  const delegate = useContractRead({
    address: token.contractAddress,
    abi: abi,
    functionName: "delegates",
    args: [account.address],
    select: (delegate) => {
      return { isDelegated: delegate !== account.address, delegate };
    },
    suspense: true,
    watch: true,
  });

  return delegate;
};

export function useVotesToDelegate(token: VotingPowerToken, delegator: string) {
  return useContractRead({
    address: token.contractAddress,
    abi: abi,
    functionName: "votesToDelegate",
    args: [delegator],
    select: (result) => result.toNumber(),
    suspense: true,
    watch: true,
  });
}
