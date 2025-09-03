import { IDefaultAssetInfo } from '@src/interface';

export const sepoliaDefaultAssetInfo: IDefaultAssetInfo[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    imgUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    bal: 0.203,
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    isDefaultAsset: true,
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    imgUrl:
      'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
    bal: 23.2,
    decimals: 18,
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    isDefaultAsset: true,
  },
  {
    symbol: 'WETH',
    name: 'WETH',
    imgUrl:
      'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
    bal: 0.01,
    decimals: 18,
    address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    isDefaultAsset: true,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    imgUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
    bal: 0.01,
    decimals: 18,
    address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    isDefaultAsset: true,
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    imgUrl:
      'https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009',
    bal: 0.01,
    decimals: 18,
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    isDefaultAsset: true,
  },
];
