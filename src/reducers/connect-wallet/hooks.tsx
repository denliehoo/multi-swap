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
import { useCallback } from "react";

export const useConnectWalletDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();

  const connectWalletAction = useCallback(
    (payload: IConnectWalletPayload) => dispatch(connectWallet(payload)),
    [dispatch]
  );

  const changeWalletAction = useCallback(
    (address: string) => dispatch(changeWallet(address)),
    [dispatch]
  );

  const disconnectWalletAction = useCallback(
    () => dispatch(disconnectWallet()),
    [dispatch]
  );

  const connectSmartContractAction = useCallback(
    (contract: any) => dispatch(connectSmartContract(contract)),
    [dispatch]
  );

  const changeChainConnectWalletReducer = useCallback(
    (chain: EBlockchainNetwork) => dispatch(changeChain(chain)),
    [dispatch]
  );

  const attemptToConnectWalletAction = useCallback(
    (chain: EBlockchainNetwork) => dispatch(attemptToConnectWallet(chain)),
    [dispatch]
  );

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
