import classes from "./NavBar.module.css";
import { Menu } from "antd";
import { connect } from "react-redux";
import { FC, useEffect, useState } from "react";

import IconComponent from "../../swap/shared/IconComponent";
import multiswapLogo from "@src/assets/images/multiswapLogo.png";
import { useWindowSize } from "@src/hooks/useWindowSize";
import { EBlockchainNetwork } from "@src/enum";
import {
  changeWalletAction,
  disconnectWalletAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer,
} from "@src/reducers/connect-wallet";
import { changeChainCustomTokenReducer } from "@src/reducers/custom-token";
import { RootState } from "@src/store";
import { Dispatch } from "redux";

import useNetworkHandler from "./hooks";
import NavBarDrawer from "./NavBarDrawer";
import { getNetworkPortion, getWalletConnectPortion } from "./utils";

interface INavBar {
  changeWalletAction: (payload: string) => void;
  disconnectWalletAction: () => void;
  changeChainCustomTokenReducer: (payload: EBlockchainNetwork) => void;
  attemptToConnectWallet: (payload: EBlockchainNetwork) => Promise<boolean>;
  address: string;
  walletConnected: boolean;
  chain: EBlockchainNetwork;
}

const NavBar: FC<INavBar> = ({
  changeWalletAction,
  disconnectWalletAction,
  changeChainCustomTokenReducer,
  attemptToConnectWallet,
  address,
  walletConnected,
  chain,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [remainingChains, setRemainingChains] = useState<EBlockchainNetwork[]>([
    EBlockchainNetwork.GOERLI,
  ]);
  const { width } = useWindowSize();

  const { handleNetworkChange } = useNetworkHandler(
    chain,
    remainingChains,
    setRemainingChains,
    changeChainCustomTokenReducer,
    changeChainConnectWalletReducer,
    attemptToConnectWallet
  );

  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        await attemptToConnectWallet(chain);
      } else {
        console.log("MetaMask is not installed");
      }
    };

    checkMetaMaskConnection();
    changeChainCustomTokenReducer(chain);
  }, []);

  useEffect(() => {
    width && width > 500 && closeDrawer();
  }, [width]);

  useEffect(() => {
    console.log("wallet", walletConnected, window.ethereum);
    if (walletConnected && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        changeWalletAction(accounts[0]);
      });
      window.ethereum.on("chainChanged", async () => {
        // TODO: Sanity check on network change
        // console.log(`Chain changed to ${chainId}`)
        disconnectWalletAction();
        await attemptToConnectWallet(chain);
      });
    }
  }, [
    attemptToConnectWallet,
    chain,
    changeWalletAction,
    disconnectWalletAction,
    walletConnected,
  ]);

  const connectWalletHandler = async () => {
    if (!walletConnected) {
      await attemptToConnectWallet(chain);
    }
  };

  const menuItems: any = [
    getNetworkPortion(chain, handleNetworkChange, remainingChains),
    getWalletConnectPortion(
      walletConnected,
      address,
      connectWalletHandler,
      disconnectWalletAction
    ),
  ];

  return (
    <nav className={classes.navBar}>
      <div className={classes.leftItem}>
        <div
          style={{ fontSize: "large", paddingTop: "10px", paddingLeft: "30px" }}
        >
          <IconComponent imgUrl={multiswapLogo} size={"small"} />
          Multiswap
        </div>
      </div>
      <div className={classes.rightItems}>
        {width && width < 500 ? (
          <NavBarDrawer
            showDrawer={showDrawer}
            closeDrawer={closeDrawer}
            openDrawer={openDrawer}
            rightItems={menuItems}
            width={width}
          />
        ) : (
          <Menu
            items={menuItems}
            mode={"horizontal"}
            className={classes.antdMenu}
          />
        )}
      </div>
    </nav>
  );
};

const mapStateToProps = ({ connectWalletReducer }: RootState) => ({
  address: connectWalletReducer.address,
  walletConnected: connectWalletReducer.walletConnected,
  chain: connectWalletReducer.chain,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeWalletAction: (payload: string) =>
    dispatch(changeWalletAction(payload)),
  disconnectWalletAction: () => dispatch(disconnectWalletAction()),
  changeChainCustomTokenReducer: (payload: EBlockchainNetwork) =>
    dispatch(changeChainCustomTokenReducer(payload)),
  changeChainConnectWalletReducer: (payload: EBlockchainNetwork) =>
    dispatch(changeChainConnectWalletReducer(payload)),
  attemptToConnectWallet: (chain: EBlockchainNetwork) =>
    dispatch(attemptToConnectWallet(chain)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
