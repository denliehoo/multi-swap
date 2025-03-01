import { EBlockchainNetwork } from "../../enum";

export enum EWalletAction {
  CONNECT_WALLET = "CONNECT_WALLET",
  CHANGE_WALLET = "CHANGE_WALLET",
  DISCONNECT_WALLET = "DISCONNECT_WALLET",
  CONNECT_SMART_CONTRACT = "CONNECT_SMART_CONTRACT",
  CHANGE_CHAIN = "CHANGE_CHAIN",
}

// TODO: Proper typing for web3 and multiswap
export interface IConnectWalletPayload {
  address: string;
  web3: any;
}
export const connectWalletAction = (payload: IConnectWalletPayload) => ({
  type: EWalletAction.CONNECT_WALLET,
  payload,
});

export const changeWalletAction = (payload: string) => ({
  type: EWalletAction.CHANGE_WALLET,
  payload,
});

export const disconnectWalletAction = () => ({
  type: EWalletAction.DISCONNECT_WALLET,
});

// connect multiswap contract
export const connectSmartContractAction = (payload: any) => ({
  type: EWalletAction.CONNECT_SMART_CONTRACT,
  payload,
});

export const changeChainConnectWalletReducer = (
  payload: EBlockchainNetwork
) => ({
  type: EWalletAction.CHANGE_CHAIN,
  payload,
});
