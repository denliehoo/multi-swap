import { EBlockchainNetwork } from '../enum';

export const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';
export const WETH_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.SEPOLIA]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  [EBlockchainNetwork.FTM]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [EBlockchainNetwork.ETH]: '',
};
export const UINT_256_MAX_AMOUNT =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const MULTISWAP_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.SEPOLIA]: '0xCD34486AABE14B61388f06b8297BaDC5FF7C6a64',
  [EBlockchainNetwork.FTM]: '0x439de68f77b135AA56beB2825Be77aA20fbb4384',
  [EBlockchainNetwork.ETH]: '',
};
