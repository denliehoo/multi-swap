export * from "./ethDefaultAssetInfo";
export * from "./goerliDefaultAssetInfo";
export * from "./ftmDefaultAssetInfo";

export interface IDefaultAssetInfo {
  symbol: string;
  name: string;
  imgUrl: string;
  bal: number;
  decimals: number;
  address: string;
  isDefaultAsset: boolean;
}
