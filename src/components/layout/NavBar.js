import classes from "./NavBar.module.css";
import { Menu, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
} from '../../reducers/connectWalletReducer'
import { useEffect } from 'react'
import { changeChain } from '../../reducers/customTokenReducer'

const NavBar = ({
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  changeChainAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  address,
  walletConnected,
  chain,
}) => {
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        await attemptToConnectWallet()
      } else {
        console.log('MetaMask is not installed')
      }
    }

    checkMetaMaskConnection()
    changeChainAction(chain)
  }, [])

  useEffect(() => {
    if (walletConnected && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        changeWalletAction(accounts[0])
      })
    } else {
    }
  }, [walletConnected])

  const connectWalletHandler = async () => {
    if (!walletConnected) {
      await attemptToConnectWallet()
    }
  }

  // const middleItems = [
  //   { label: 'Swap', key: 'swap' },
  //   {
  //     label: 'DAO',
  //     key: 'daoMenu',

  //     children: [
  //       { label: 'Vote', key: 'daoVote' },
  //       { label: 'Forum', key: 'daoForum' },
  //     ],
  //   },
  // ]

  const addressOrConnectButton = (
    <div>
      {address ? (
        <div>{address.substring(0, 4) + '...' + address.slice(-4)}</div>
      ) : (
        <div onClick={connectWalletHandler}>Connect Wallet</div>
      )}
    </div>
  )

  const walletConnectPortion =
    walletConnected && address
      ? {
          label: addressOrConnectButton,
          key: 'connectWallet',
          children: [
            {
              label: <div onClick={disconnectWalletAction}>Disconnect</div>,
              key: 'disconnectWallet',
            },
          ],
        }
      : { label: addressOrConnectButton, key: 'connectWallet' }

  const rightItems = [
    {
      label: '[Logo] Fantom',
      key: 'ftm',
      children: [
        { label: '[Logo] Ethereum', key: 'eth' },
        { label: '[Logo] Avalanche', key: 'avax' },
      ],
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
  ]

  return (
    <Row justify="space-between">
      <Col style={{fontSize: 'large', paddingTop: '10px', paddingLeft: '30px'}}>Multiswap</Col>
      <Col>
        <Menu items={rightItems} mode={'horizontal'} className={classes.navbar}/>
        </Col>
        </Row>
  )
}

const mapStateToProps = ({ connectWalletReducer }) => ({
  address: connectWalletReducer.address,
  walletConnected: connectWalletReducer.walletConnected,
  chain: connectWalletReducer.chain,
})

const mapDispatchToProps = (dispatch) => ({
  connectWalletAction: (payload) => dispatch(connectWalletAction(payload)),
  changeWalletAction: (payload) => dispatch(changeWalletAction(payload)),
  disconnectWalletAction: () => dispatch(disconnectWalletAction()),
  changeChainAction: (payload) => dispatch(changeChain(payload)),
  connectSmartContractAction: (payload) =>
    dispatch(connectSmartContractAction(payload)),
  attemptToConnectWallet: () => dispatch(attemptToConnectWallet()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

// import React from 'react';
// import classes from './NavBar.module.css';

// const Navbar = () => {
//   return (
//     <nav>
//       <ul className={classes.navbar}>
//         <li className={classes.navbar__item}>
//           <a href="#">Item 1</a>
//           <ul className={classes.navbar__sub_menu}>
//             <li className={classes.navbar__sub_menu_item}>
//               <a href="#" onClick={() => alert('Sub-menu item 1 clicked')}>Sub-menu Item 1</a>
//             </li>
//             <li className={classes.navbar__sub_menu_item}>
//               <a href="#" onClick={() => alert('Sub-menu item 2 clicked')}>Sub-menu Item 2</a>
//             </li>
//           </ul>
//         </li>
//         <li className={classes.navbar__item}>
//           <a href="#">Item 2</a>
//         </li>
//         <li className={classes.navbar__item}>
//           <a href="#">Item 3</a>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
