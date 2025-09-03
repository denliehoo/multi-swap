export interface IDefaultAssetInfo {
  symbol: string;
  name: string;
  imgUrl: string;
  bal: number; // TODO: change all to balance for consistency
  decimals: number;
  address: string;
  isDefaultAsset: boolean;
}
// biome-ignore lint/suspicious/noExplicitAny: <TODO: Implement>
export type IWeb3 = any;
// biome-ignore lint/suspicious/noExplicitAny: <TODO: Implement>
export type IMultiswap = any;
// biome-ignore lint/suspicious/noExplicitAny: <TODO: Implement>
export type IContract = any;
