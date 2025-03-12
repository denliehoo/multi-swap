import classes from "./NavBar.module.css";
import { Menu } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import IconComponent from "../../swap/shared/IconComponent";
import multiswapLogo from "@src/assets/images/multiswapLogo.png";
import { useWindowSize } from "@src/hooks/useWindowSize";
import { EBlockchainNetwork } from "@src/enum";

import useNetworkHandler from "./hooks";
import NavBarDrawer from "./NavBarDrawer";
import { getNetworkPortion, getWalletConnectPortion } from "./utils";
import {
  useConnectWalletDispatch,
  useConnectWalletState,
} from "@src/reducers/connect-wallet";
import { useCustomTokenDispatch } from "@src/reducers/custom-token";

const NavBar: FC = () => {
  const { address, chain, walletConnected } = useConnectWalletState();
  const {
    changeWalletAction,
    disconnectWalletAction,
    attemptToConnectWalletAction: attemptToConnectWallet,
    changeChainConnectWalletReducer,
  } = useConnectWalletDispatch();

  const { changeChainCustomTokenReducer } = useCustomTokenDispatch();

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

  // TODO: Solve infinite loop issue, temporarily other dependecies from useEffect
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // attemptToConnectWallet, changeChainCustomTokenReducer,
    chain,
  ]);

  useEffect(() => {
    width && width > 500 && closeDrawer();
  }, [width]);

  useEffect(() => {
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

  const connectWalletHandler = useCallback(async () => {
    if (!walletConnected) {
      await attemptToConnectWallet(chain);
    }
  }, [walletConnected, attemptToConnectWallet, chain]);

  // TODO: Solve infinite loop issue , getNetworkPortion called multiple times
  const menuItems: any = useMemo(
    () => [
      getNetworkPortion(chain, handleNetworkChange, remainingChains),
      getWalletConnectPortion(
        walletConnected,
        address,
        connectWalletHandler,
        disconnectWalletAction
      ),
    ],
    [
      chain,
      handleNetworkChange,
      remainingChains,
      walletConnected,
      address,
      connectWalletHandler,
      disconnectWalletAction,
    ]
  );

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

export default NavBar;
