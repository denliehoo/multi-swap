import { EBlockchainNetwork } from '../../enum';

export interface ICustomToken {
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
  address: string;
}

export interface ICustomTokenState {
  chain: EBlockchainNetwork;
  eth: ICustomToken[];
  ftm: ICustomToken[];
  sepolia: ICustomToken[];
}
