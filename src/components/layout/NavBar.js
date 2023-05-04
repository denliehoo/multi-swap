import classes from "./NavBar.module.css";
import { Menu, Drawer } from "antd";
import { connect } from "react-redux";
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer,
} from "../../reducers/connectWalletReducer";
import { useEffect, useRef, useState } from "react";
import { changeChainCustomTokenReducer } from "../../reducers/customTokenReducer";
import fantomLogo from "../../assets/images/fantomLogo.svg";
import goerliLogo from "../../assets/images/goerliLogo.svg";
import IconComponent from "../swap/shared/IconComponent";
import multiswapLogo from "../../assets/images/multiswapLogo.png";
import { useWindowSize } from "../../hooks/useWindowSize";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import ConnectWalletPopup from "../shared/ConnectWalletPopup";

const NavBar = ({
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  changeChainCustomTokenReducer,
  changeChainConnectWalletReducer,
  connectSmartContractAction,
  attemptToConnectWallet,
  address,
  walletConnected,
  chain,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [remainingChains, setRemainingChains] = useState(["goerli"]);
  const [userClickNetwork, setIsUserClickNetwork] = useState(false);
  const { width } = useWindowSize();
  const userClickNetworkRef = useRef(userClickNetwork);

  const openDrawer = () => {
    setShowDrawer(true);
  };
  const closeDrawer = () => {
    setShowDrawer(false);
  };

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
    width > 500 && closeDrawer();
  }, [width]);

  useEffect(() => {
    userClickNetworkRef.current = userClickNetwork;
  }, [userClickNetwork]);

  useEffect(() => {
    if (walletConnected && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        changeWalletAction(accounts[0]);
      });
      window.ethereum.on("chainChanged", async (chainId) => {
        if (!userClickNetworkRef.current) {
          // console.log(`Chain changed to ${chainId}`)
          disconnectWalletAction();
          await attemptToConnectWallet(chain);
          setIsUserClickNetwork(false);
        }
      });
    } else {
    }
  }, [walletConnected, userClickNetwork]);

  const connectWalletHandler = async () => {
    if (!walletConnected) {
      // if (window.ethereum) {
      await attemptToConnectWallet(chain);
      // } else {
      // alert("try metamask");
      // }
    }
  };

  const addressOrConnectButton = (
    <span>
      {address ? (
        <span>{address.substring(0, 4) + "..." + address.slice(-4)}</span>
      ) : window.ethereum ? (
        <span onClick={connectWalletHandler}>Connect Wallet</span>
      ) : (
        <ConnectWalletPopup placement="bottom" />
      )}
    </span>
  );

  const walletConnectPortion =
    walletConnected && address
      ? {
          label: addressOrConnectButton,
          key: "connectWallet",
          children: [
            {
              label: <div onClick={disconnectWalletAction}>Disconnect</div>,
              key: "disconnectWallet",
            },
          ],
        }
      : { label: addressOrConnectButton, key: "connectWallet" };

  const networkLabels = (_chain, _isHeader) => {
    let _chainLogo, _chainName;
    if (_chain === "goerli") {
      _chainLogo = goerliLogo;
      _chainName = "Goerli";
    } else if (_chain === "ftm") {
      _chainLogo = fantomLogo;
      _chainName = "Fantom";
    }
    if (!_isHeader) {
      return {
        label: (
          <span
            onClick={async () => {
              let networkChanged = await attemptToConnectWallet(_chain);
              if (networkChanged) {
                let newRemainingChain = remainingChains.filter(
                  (c) => c !== _chain
                );
                newRemainingChain.push(chain);
                setRemainingChains(newRemainingChain);
                changeChainCustomTokenReducer(_chain);
                changeChainConnectWalletReducer(_chain);
                setIsUserClickNetwork(true);
              } else {
                console.log("Network failed to change");
              }
            }}
          >
            <IconComponent imgUrl={_chainLogo} size={"small"} /> {_chainName}
          </span>
        ),
        key: _chainName,
      };
    } else {
      return (
        <span>
          <IconComponent imgUrl={_chainLogo} size={"small"} /> {_chainName}
        </span>
      );
    }
  };

  const rightItems = [
    {
      label: networkLabels(chain, true),
      // label: <span>[Logo] Goerli</span>,
      key: "networkName",
      children: remainingChains.map((c) => networkLabels(c, false)),
      // children: [
      //   { label: '[Logo] Goerli', key: 'goerli' },
      //   { label: '[Logo] Avalanche', key: 'avax' },
      // ],
    },
    walletConnectPortion,
    // {
    //   label: 'Settings',
    //   key: 'settingMenu',
    //   children: [
    //     { label: '[Icon] Dark mode', key: 'settingsDark' },
    //     { label: '[Icon] Light mode', key: 'settingsLight' },
    //   ],
    // },
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
        {width < 500 ? (
          <>
            <div className={classes.hamburgerMenu} onClick={openDrawer}>
              <MenuOutlined />
            </div>
            <Drawer
              title={null}
              headerStyle={{ border: 0 }}
              placement="right"
              onClose={closeDrawer}
              visible={showDrawer}
              width={width}
              closeIcon={<CloseOutlined style={{ color: "#86C232" }} />}
            >
              <Menu
                items={rightItems}
                mode={"inline"}
                className={classes.antdMenu}
              />
            </Drawer>
          </>
        ) : (
          <>
            <Menu
              items={rightItems}
              mode={"horizontal"}
              className={classes.antdMenu}
            />
          </>
        )}
      </div>

      {/* {width > 500 ? (
        <div className={classes.rightItems}>
          <Menu
            items={rightItems}
            mode={'horizontal'}
            className={classes.antdMenu}
          />
        </div>
      ) : ( showDrawer && 
        <div style={classes.rightItemMobile}>
          <Menu
            items={rightItems}
            mode={'vertifcal'}
            className={classes.antdMenu}
          />
        </div>
      )} */}
    </nav>
  );
};

const mapStateToProps = ({ connectWalletReducer }) => ({
  address: connectWalletReducer.address,
  walletConnected: connectWalletReducer.walletConnected,
  chain: connectWalletReducer.chain,
});

const mapDispatchToProps = (dispatch) => ({
  connectWalletAction: (payload) => dispatch(connectWalletAction(payload)),
  changeWalletAction: (payload) => dispatch(changeWalletAction(payload)),
  disconnectWalletAction: () => dispatch(disconnectWalletAction()),
  changeChainCustomTokenReducer: (payload) =>
    dispatch(changeChainCustomTokenReducer(payload)),
  changeChainConnectWalletReducer: (payload) =>
    dispatch(changeChainConnectWalletReducer(payload)),
  connectSmartContractAction: (payload) =>
    dispatch(connectSmartContractAction(payload)),
  attemptToConnectWallet: (chain) => dispatch(attemptToConnectWallet(chain)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
