export const withVotingDelegation = (strategy: Strategy): Strategy => {
  return async (userAddress: string, communityAddress: string, blockTag: string, provider: Provider) => {
    const contract = new Contract(delegationRegistryAddress, delegationRegistryAbi, provider);
    const delegators = await contract.delegators(communityAddress, userAddress, { blockTag: parseBlockTag(blockTag) });
    const results = await Promise.all(
      [userAddress, ...delegators].map((userAddress) => strategy(userAddress, communityAddress, blockTag, provider))
    );

    return results.reduce((total, result) => total + result, 0);
  };
};

// Usage
export const communities = new CaseInsensitiveMap(
  Object.entries({
    // nouns
    '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03': withVotingDelegation(nouns(10)),
    // onchainmonkey
    '0x960b7a6bcd451c9968473f7bbfd9be826efd549a': withVotingDelegation(onchainMonkey()),
    //...
  })
);