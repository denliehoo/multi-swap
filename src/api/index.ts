import axios from 'axios';
import { localStorageKey } from '../config';

const getAssetPrice = async (chain: string, asset: string, address: string) => {
  if (asset === 'ETH') {
    // call eth price
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );
    return res.data.ethereum.usd;
  } else if (asset === 'FTM') {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd',
    );
    return res.data.fantom.usd;
  }

  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/${address}/price`,
    {
      params: { chain: chain },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
      },
    },
  );
  return res.data.usdPrice;
};

const getDetailsForCustomToken = async (
  chain: string,
  tokenAddress: string,
) => {
  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`,
    {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
      },
    },
  );
  return res;
};

// TODO: Convert chain to enum
const getContractABI = async (chain: string, address: string) => {
  let res;
  if (chain === 'goerli') {
    res = await axios.get(
      `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    );
  } else if (chain === 'ftm') {
    res = await axios.get(
      `https://api.ftmscan.com/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_FTMSCAN_API_KEY}`,
    );
  }
  if (res?.status === 200) {
    return JSON.parse(res.data.result);
  } else {
    // likely means contract not verified
    return null;
  }
};

export { getAssetPrice, getDetailsForCustomToken, getContractABI };
