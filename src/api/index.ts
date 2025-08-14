import axios from 'axios';

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

export { getDetailsForCustomToken, getContractABI };
