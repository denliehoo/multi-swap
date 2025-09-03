const getAssetPrice = async (chain: string, asset: string, address: string) => {
  const params = new URLSearchParams({
    chain,
    asset,
    address,
  });

  return await fetch(`/api/asset-price?${params.toString()}`)
    .then((res) => res.text())
    .then((text) => Number.parseFloat(text));
};

const getDetailsForCustomToken = async (
  chain: string,
  tokenAddress: string,
) => {
  const params = new URLSearchParams({
    chain,
    tokenAddress,
  });

  return await fetch(`/api/custom-token-details?${params.toString()}`).then(
    (res) => res.json(),
  );
};

// BOO: 0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE
// USDC: 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
// LQDR: 0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9
// LQDR, BOO, USDC:
// [0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9,0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE,0x04068DA6C83AFCFA0e13ba15A6696662335D5B75]
// should take it the token address and return the user balances in that order. Dont forget to add in the native balance also
const getTokenBalances = async (
  chain: string,
  walletAddress: string,
  tokenAddresses: string[],
) => {
  const params = new URLSearchParams({
    chain,
    walletAddress,
    tokenAddresses: tokenAddresses.join(','),
  });

  return await fetch(`/api/token-balances?${params.toString()}`).then((res) =>
    res.json(),
  );
};

// TODO: Convert chain to enum
const getContractABI = async (chain: string, address: string) => {
  const params = new URLSearchParams({
    chain,
    address,
  });

  return await fetch(`/api/contract-abi?${params.toString()}`).then((res) =>
    res.json(),
  );
};

export {
  getAssetPrice,
  getDetailsForCustomToken,
  getTokenBalances,
  getContractABI,
};
