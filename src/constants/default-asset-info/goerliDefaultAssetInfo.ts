import { IDefaultAssetInfo } from "@src/interface";

export const goerliDefaultAssetInfo: IDefaultAssetInfo[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    imgUrl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    bal: 0.203,
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    isDefaultAsset: true,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    imgUrl:
      "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604",
    bal: 23.2,
    decimals: 18,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    isDefaultAsset: true,
  },
  {
    symbol: "WETH",
    name: "WETH",
    imgUrl:
      "https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295",
    bal: 0.01,
    decimals: 18,
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    isDefaultAsset: true,
  },
];
