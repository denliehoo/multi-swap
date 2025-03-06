import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@src/store";
import {
  connectWallet,
  changeWallet,
  disconnectWallet,
  connectSmartContract,
  changeChain,
  attemptToConnectWallet,
  IConnectWalletPayload,
} from "./reducer";
import { EBlockchainNetwork } from "@src/enum";

export const useConnectWalletDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();

  const connectWalletAction = (payload: IConnectWalletPayload) =>
    dispatch(connectWallet(payload));
  const changeWalletAction = (address: string) =>
    dispatch(changeWallet(address));
  const disconnectWalletAction = () => dispatch(disconnectWallet());
  const connectSmartContractAction = (contract: any) =>
    dispatch(connectSmartContract(contract));
  const changeChainConnectWalletReducer = (chain: EBlockchainNetwork) =>
    dispatch(changeChain(chain));
  const attemptToConnectWalletAction = (chain: EBlockchainNetwork) =>
    dispatch(attemptToConnectWallet(chain));

  return {
    connectWalletAction,
    changeWalletAction,
    disconnectWalletAction,
    connectSmartContractAction,
    changeChainConnectWalletReducer,
    attemptToConnectWalletAction,
  };
};

export const useConnectWalletState = () => {
  return useSelector((state: RootState) => state.connectWalletReducer);
};
