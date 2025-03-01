import { EBlockchainNetwork } from "../../enum";

export interface ICustomToken {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  address: string;
}

export interface ICustomTokenState {
  chain: EBlockchainNetwork;
  eth: ICustomToken[];
  ftm: ICustomToken[];
  goerli: ICustomToken[];
}
