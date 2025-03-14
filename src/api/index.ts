import axios from "axios";
import { localStorageKey } from "../config";

const getAssetPrice = async (chain: string, asset: string, address: string) => {
  if (asset === "ETH") {
    // call eth price
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    return res.data.ethereum.usd;
  } else if (asset === "FTM") {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd"
    );
    return res.data.fantom.usd;
  }

  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/${address}/price`,
    {
      params: { chain: chain },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY || "",
      },
    }
  );
  return res.data.usdPrice;
};

const getDetailsForCustomToken = async (
  chain: string,
  tokenAddress: string
) => {
  const res = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY || "",
      },
    }
  );
  return res;
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
  tokenAddresses: string[]
) => {
  const encodeBase64 = (text: string) => {
    if (typeof btoa === "function") {
      return btoa(text);
    } else {
      const buffer = Buffer.from(text, "binary");
      return buffer.toString("base64");
    }
  };

  const decodeBase64 = (text: any) => {
    if (typeof atob === "function") {
      return atob(text);
    } else {
      const buffer = Buffer.from(text, "base64");
      return buffer.toString("binary");
    }
  };
  // const localStorageKey = 'Y2FjaGVkQmFsYW5jZXM='
  let dataFromLocalStorage = localStorage.getItem(localStorageKey);
  if (dataFromLocalStorage) {
    dataFromLocalStorage = JSON.parse(decodeBase64(dataFromLocalStorage));
    // TODO: Proper type
    const { timestamp, data } = dataFromLocalStorage as any;
    if (timestamp && data[chain]) {
      // if it has been less than 600s (600000) since balance was last fetched, we return from local
      if (Date.now() - timestamp <= 600000) {
        return data[chain];
      }
    }
    // else if it has been more than 600s || diff chain, we remove from local and get token balance from API
    localStorage.removeItem(localStorageKey);
  }

  let tokenBalances: number[] = [];
  const nativeBalanceResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${walletAddress}/balance`,
    {
      params: { chain: chain },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY || "",
      },
    }
  );
  tokenBalances.push(
    parseFloat(nativeBalanceResponse.data.balance) / Math.pow(10, 18)
  );
  tokenAddresses.splice(0, 1); // removes the first element which is address = 'native'

  const tokenBalancesResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20`,
    {
      params: { chain: chain, token_addresses: tokenAddresses },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY || "",
      },
    }
  );
  let rawBalances = tokenBalancesResponse.data;
  for (let t in tokenAddresses) {
    let pushZero = true;
    for (let r in rawBalances) {
      if (
        tokenAddresses[t].toUpperCase() ===
        rawBalances[r].token_address.toUpperCase()
      ) {
        let bal =
          parseFloat(rawBalances[r].balance) /
          Math.pow(10, rawBalances[r].decimals);
        tokenBalances.push(bal);
        rawBalances.splice(r, 1);
        pushZero = false;
        break;
      }
    }
    pushZero && tokenBalances.push(0);
  }

  localStorage.setItem(
    localStorageKey,
    encodeBase64(
      JSON.stringify({
        timestamp: Date.now(),
        data: { [chain]: tokenBalances },
      })
    )
  );
  return tokenBalances;
};

// TODO: Convert chain to enum
const getContractABI = async (chain: string, address: string) => {
  let res;
  if (chain === "goerli") {
    res = await axios.get(
      `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
    );
  } else if (chain === "ftm") {
    res = await axios.get(
      `https://api.ftmscan.com/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_FTMSCAN_API_KEY}`
    );
  }
  if (res?.status === 200) {
    return JSON.parse(res.data.result);
  } else {
    // likely means contract not verified
    return null;
  }
};

export {
  getAssetPrice,
  getDetailsForCustomToken,
  getTokenBalances,
  getContractABI,
};
