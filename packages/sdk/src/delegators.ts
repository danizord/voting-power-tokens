import { ethers } from "ethers";
import { flat, sort } from "radash";
import { match } from "ts-pattern";
import { VotingPowerToken } from "./index";

type DelegatorAddress = `0x${string}`;

export const getDelegators = async ({
  token,
  account,
  provider,
}: {
  token: VotingPowerToken;
  account: string;
  provider: ethers.providers.Provider;
}) => {
  const source = token.source?.getContract(provider);
  const derivative = token.getContract(provider);

  // Fetch in parallel all DelegateChanged events "to" and "from" account, in both source and derivative contracts
  let aggregatedEvents = flat(
    await Promise.all([
      ...(source ? [source.queryFilter(source.filters.DelegateChanged(null, null, account))] : []),
      ...(source ? [source.queryFilter(source.filters.DelegateChanged(null, account, null))] : []),
      ...[derivative.queryFilter(derivative.filters.DelegateChanged(null, null, account))],
      ...[derivative.queryFilter(derivative.filters.DelegateChanged(null, account, null))],
    ])
  );

  // Remove self-delegation events;
  aggregatedEvents = aggregatedEvents.filter((e) => e.args.delegator !== account);

  // Sort by block number
  aggregatedEvents = sort(aggregatedEvents, (e) => e.blockNumber);

  const delegators = aggregatedEvents.reduce((state, event) => {
    match(event.args)
      .when(
        (e) => e.toDelegate === account,
        () => state.add(event.args.delegator as DelegatorAddress)
      )
      .when(
        (e) => e.fromDelegate === account,
        () => state.delete(event.args.delegator as DelegatorAddress)
      )
      .run();

    return state;
  }, new Set<DelegatorAddress>());

  return delegators;
};
