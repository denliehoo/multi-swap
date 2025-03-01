import { changeChainCustomTokenReducer } from "../../reducers/customTokenReducer";
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer,
} from "../../reducers/connectWalletReducer";

import { Dispatch } from "redux";

export const mapStateToProps = ({ connectWalletReducer }: any) => ({
  address: connectWalletReducer.address,
  walletConnected: connectWalletReducer.walletConnected,
  chain: connectWalletReducer.chain,
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  connectWalletAction: (payload: any) => dispatch(connectWalletAction(payload)),
  changeWalletAction: (payload: any) => dispatch(changeWalletAction(payload)),
  disconnectWalletAction: () => dispatch(disconnectWalletAction()),
  changeChainCustomTokenReducer: (payload: any) =>
    dispatch(changeChainCustomTokenReducer(payload)),
  changeChainConnectWalletReducer: (payload: any) =>
    dispatch(changeChainConnectWalletReducer(payload)),
  connectSmartContractAction: (payload: any) =>
    dispatch(connectSmartContractAction(payload)),
  attemptToConnectWallet: (chain: any) =>
    dispatch(attemptToConnectWallet(chain)),
});
