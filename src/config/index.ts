import { EBlockchainNetwork } from "../enum";

export const localStorageKey = "Y2FjaGVkQmFsYW5jZXM=";
export const NATIVE_ADDRESS = "0x0000000000000000000000000000000000000000";
export const WETH_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.GOERLI]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  [EBlockchainNetwork.FTM]: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  [EBlockchainNetwork.ETH]: "",
};
export const UINT_256_MAX_AMOUNT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export const MULTISWAP_ADDRESS: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.GOERLI]: "0x6aD14F3770bb85a35706DCa781E003Fcf1e716e3",
  [EBlockchainNetwork.FTM]: "0x439de68f77b135AA56beB2825Be77aA20fbb4384",
  [EBlockchainNetwork.ETH]: "",
};
