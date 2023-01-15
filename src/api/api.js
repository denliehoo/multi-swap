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

export { getAssetPrice, getDetailsForCustomToken }
