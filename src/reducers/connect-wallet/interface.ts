import { IMultiswap, IWeb3 } from '@src/interface';
import { EBlockchainNetwork } from '../../enum';

export interface IConnectWalletState {
  address: string;
  walletConnected: boolean;
  chain: EBlockchainNetwork;
  multiswap: IMultiswap;
  web3: IWeb3;
}
