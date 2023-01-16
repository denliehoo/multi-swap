import axios from 'axios'

const getAssetPrice = async (chain, asset, address) => {
  if (asset === 'ETH') {
    // call eth price
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    )
    return res.data.ethereum.usd
  } else if (asset === 'FTM') {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd',
    )
    return res.data.fantom.usd
  }

  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/${address}/price`,
    {
      params: { chain: chain },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
      },
    },
  )
  return res.data.usdPrice
}

const getDetailsForCustomToken = async (chain, tokenAddress) => {
  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`,
    {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
      },
    },
  )
  return res
}

// BOO: 0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE
// USDC: 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
// LQDR: 0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9
// LQDR, BOO, USDC:
// [0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9,0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE,0x04068DA6C83AFCFA0e13ba15A6696662335D5B75]
// should take it the token address and return the user balances in that order. Dont forget to add in the native balance also
const getTokenBalances = async (chain, walletAddress, tokenAddresses) => {
  let tokenBalances = [];
  const nativeBalanceResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${walletAddress}/balance`,
    {
      params: { chain: chain },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
      },
    },
  )
  tokenBalances.push(parseInt(nativeBalanceResponse.data.balance)/(Math.pow(10,18)))
  tokenAddresses.splice(0,1) // removes the first element which is address = 'native'


  const tokenBalancesResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20`,
    {
      params: { chain: chain, token_addresses: tokenAddresses },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
      },
    },
  )
  let rawBalances = tokenBalancesResponse.data
  for (let t in tokenAddresses) {
    let pushZero = true
    for (let r in rawBalances) {
      if (
        tokenAddresses[t].toUpperCase() ==
        rawBalances[r].token_address.toUpperCase()
      ) {
        let bal =
          parseInt(rawBalances[r].balance) /
          Math.pow(10, rawBalances[r].decimals)
        tokenBalances.push(bal)
        rawBalances.splice(r, 1)
        pushZero = false
        break
      }
    }
    pushZero && tokenBalances.push(0)
  }
  return tokenBalances
}

export { getAssetPrice, getDetailsForCustomToken, getTokenBalances }
