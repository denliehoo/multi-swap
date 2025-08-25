import { EBlockchainNetwork } from '../enum';

export const localStorageKey = 'Y2FjaGVkQmFsYW5jZXM=';
export const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';
export const WETH_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.SEPOLIA]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  [EBlockchainNetwork.FTM]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [EBlockchainNetwork.ETH]: '',
};
export const UINT_256_MAX_AMOUNT =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const MULTISWAP_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.SEPOLIA]: '0x49E36698Ac0A75d8093aD33a58096508D699eA58',
  [EBlockchainNetwork.FTM]: '0x439de68f77b135AA56beB2825Be77aA20fbb4384',
  [EBlockchainNetwork.ETH]: '',
};
