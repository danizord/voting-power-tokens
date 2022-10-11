import { abi, VotingPowerToken } from "@danizord/voting-power-tokens-sdk";

import { useContractRead } from "wagmi";
import { useAccount } from "./blockchain";

export function useVotingPower(token: VotingPowerToken) {
  const account = useAccount();

  return useContractRead({
    addressOrName: token.contractAddress,
    contractInterface: abi,
    functionName: "getCurrentVotes",
    args: [account.address],
    select: (value) => value.toNumber(),
    suspense: true,
  });
}

export const useDelegate = (token: VotingPowerToken) => {
  const account = useAccount();

  const delegate = useContractRead({
    addressOrName: token.contractAddress,
    contractInterface: abi,
    functionName: "delegates",
    args: [account.address],
    // @ts-ignore
    select: (delegate: string) => {
      return { isDelegated: delegate !== account.address, delegate };
    },
    suspense: true,
  });

  return delegate;
};

export function useVotesToDelegate(token: VotingPowerToken, delegator: string) {
  return useContractRead({
    addressOrName: token.contractAddress,
    contractInterface: abi,
    functionName: "votesToDelegate",
    args: [delegator],
    select: (result) => result.toNumber(),
    suspense: true,
  });
}
