export interface ISwapDetails {
  index: number;
  symbol: string;
  address: string;
  balance: number;
  amount: number; // percentage => number , amount => string
  decimals: number;
  imgUrl: string;
}

export interface ISwapState {
  swapFrom: ISwapDetails[];
  swapTo: ISwapDetails[];
}
