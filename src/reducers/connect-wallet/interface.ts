import { EBlockchainNetwork } from "../../enum";

export interface IConnectWalletState {
  address: string;
  walletConnected: boolean;
  chain: EBlockchainNetwork;
  multiswap: any;
  web3: any;
}
