import { EBlockchainNetwork } from "@src/enum";
import {
  changeWalletAction,
  disconnectWalletAction,
  changeChainConnectWalletReducer,
  connectSmartContractAction,
  attemptToConnectWallet,
} from "@src/reducers/connect-wallet";
import { changeChainCustomTokenReducer } from "@src/reducers/custom-token";
import { RootState } from "@src/store";
import { Dispatch } from "redux";

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
