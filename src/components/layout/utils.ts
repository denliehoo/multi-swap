import { changeChainCustomTokenReducer } from "../../reducers/custom-token";
import {
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer,
} from "../../reducers/connect-wallet";

import { Dispatch } from "redux";
import { EBlockchainNetwork } from "../../enum";
import { RootState } from "../../store";

export const mapStateToProps = ({ connectWalletReducer }: RootState) => ({
  address: connectWalletReducer.address,
  walletConnected: connectWalletReducer.walletConnected,
  chain: connectWalletReducer.chain,
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeWalletAction: (payload: string) =>
    dispatch(changeWalletAction(payload)),
  disconnectWalletAction: () => dispatch(disconnectWalletAction()),
  changeChainCustomTokenReducer: (payload: EBlockchainNetwork) =>
    dispatch(changeChainCustomTokenReducer(payload)),
  changeChainConnectWalletReducer: (payload: any) =>
    dispatch(changeChainConnectWalletReducer(payload)),
  connectSmartContractAction: (payload: any) =>
    dispatch(connectSmartContractAction(payload)),
  attemptToConnectWallet: (chain: EBlockchainNetwork) =>
    dispatch(attemptToConnectWallet(chain)),
});
