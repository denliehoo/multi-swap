import axios from 'axios'

const getAssetPrice = async (chain, asset, address) => {
  if (asset === 'ETH') {
    // call eth price
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    )
    return res.data.ethereum.usd
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

export { getAssetPrice }
