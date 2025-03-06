export interface IDefaultAssetInfo {
  symbol: string;
  name: string;
  imgUrl: string;
  bal: number; // TODO: change all to balance for consistency
  decimals: number;
  address: string;
  isDefaultAsset: boolean;
}
