// import classes from "./NavBar.module.css";
import { Menu, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
} from '../../reducers/connectWalletReducer'
import { useEffect } from 'react'
import Web3 from 'web3'
import { changeChain } from '../../reducers/customTokenReducer'

const NavBar = ({
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  changeChainAction,
  address,
  walletConnected,
  chain,
}) => {
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        try {
          // Request account access if needed
          await window.ethereum.enable()
          // Acccounts now exposed
          const accounts = await web3.eth.getAccounts()
          connectWalletAction(accounts[0])
        } catch (error) {
          console.log(error)
          disconnectWalletAction()
        }
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

  const handleConnect = async () => {
    if (!walletConnected) {
      try {
        // Request account access if needed
        await window.ethereum.enable()
        // Acccounts now exposed
        const web3 = new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        connectWalletAction(accounts[0])
      } catch (error) {
        console.log(error)
        disconnectWalletAction()
      }
    }
  }

  const middleItems = [
    { label: 'Swap', key: 'swap' },
    {
      label: 'DAO',
      key: 'daoMenu',

      children: [
        { label: 'Vote', key: 'daoVote' },
        { label: 'Forum', key: 'daoForum' },
      ],
    },
  ]

  const addressOrConnectButton = (
    <div>
      {address ? (
        <div>{address.substring(0, 4) + '...' + address.slice(-4)}</div>
      ) : (
        <div onClick={handleConnect}>Connect Wallet</div>
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
    {
      label: 'Settings',
      key: 'settingMenu',
      children: [
        { label: '[Icon] Dark mode', key: 'settingsDark' },
        { label: '[Icon] Light mode', key: 'settingsLight' },
      ],
    },
  ]

  return (
    <Row justify="space-between">
      <Col span={10}>
        <Menu items={middleItems} mode={'horizontal'} />
      </Col>

      <Col span={12}>
        <Menu items={rightItems} mode={'horizontal'} />
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
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
//** before putting connect wallet together */

// // import classes from "./NavBar.module.css";
// import { Menu, Row, Col } from 'antd'
// import ConnectMetaMask from "../connectWallet/ConnectWallet"
// import { connect } from 'react-redux'
// import { disconnectWalletAction } from '../../reducers/connectWalletReducer';
// import { Button } from 'antd';

// // import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

// const NavBar = ({disconnectWalletAction, address, walletConnected}) => {
//   console.log('rerender')
//   console.log(walletConnected)
//   console.log(address)
//   const middleItems = [
//     { label: 'Swap', key: 'swap' },
//     {
//       label: 'DAO',
//       key: 'daoMenu',
//       children: [
//         { label: 'Vote', key: 'daoVote' },
//         { label: 'Forum', key: 'daoForum' },
//       ],
//     },
//   ]

//   const walletConnectPortion = (walletConnected && address) ?
//     {label: <ConnectMetaMask address={address} walletConnected={walletConnected}/>, key: 'connectWallet',
//     // {label: <ConnectMetaMask />, key: 'connectWallet',
//     children: [
//       {label: <Button onClick={disconnectWalletAction}>Disconnect</Button>, key: 'disconnectWallet'}
//     ]
//     }
//     :
//     {label: <ConnectMetaMask address={address} walletConnected={walletConnected}/>, key: 'connectWallet'}
//     // {label: <ConnectMetaMask />, key: 'connectWallet'}

//   const rightItems = [
//     {
//       label: '[Logo] Ethereum',
//       key: 'eth',
//       children: [
//         { label: '[Logo] Fantom', key: 'ftm' },
//         { label: '[Logo] Avalanche', key: 'avax' },
//       ],
//     },
//     walletConnectPortion,
//     // <ConnectMetaMask />,
//     // {label: <ConnectMetaMask />, key: 'connectWallet',
//     // children: (address && walletConnected) ?
//     // },

//     // { label: 'Connect Wallet', key: 'item-1' },
//     {
//       label: 'Settings',
//       key: 'settingMenu',
//       children: [
//         { label: '[Icon] Dark mode', key: 'settingsDark' },
//         { label: '[Icon] Light mode', key: 'settingsLight' },
//       ],
//     },
//   ]

//   return (
//     <Row justify="space-between">
//       {/* <Col span={10}></Col> */}
//       <Col span={10}>
//         <Menu items={middleItems} mode={'horizontal'} />
//       </Col>
//       {/* <Col>
//       <ConnectMetaMask />
//       </Col> */}
//       <Col span={12}>
//         <Menu items={rightItems} mode={'horizontal'} />
//       </Col>
//     </Row>
//   )
// }

// const mapStateToProps = ({ connectWalletReducer }) => ({
//   address: connectWalletReducer.address,
//   walletConnected: connectWalletReducer.walletConnected,
// })

// const mapDispatchToProps = (dispatch) => ({
//   disconnectWalletAction: () => dispatch(disconnectWalletAction()),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

// export default NavBar

// ******

// // import classes from "./NavBar.module.css";
// import { Menu, Row, Col } from 'antd'
// import ConnectMetaMask from "../connectWallet/ConnectWallet"

// // import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

// const NavBar = () => {
//   const middleItems = [
//     { label: 'Swap', key: 'swap' },
//     {
//       label: 'DAO',
//       key: 'daoMenu',
//       children: [
//         { label: 'Vote', key: 'daoVote' },
//         { label: 'Forum', key: 'daoForum' },
//       ],
//     },
//   ]

//   const rightItems = [
//     {
//       label: '[Logo] Ethereum',
//       key: 'eth',
//       children: [
//         { label: '[Logo] Fantom', key: 'ftm' },
//         { label: '[Logo] Avalanche', key: 'avax' },
//       ],
//     },
//     // <ConnectMetaMask />,
//     {label: <ConnectMetaMask />, key: 'connectWallet'},

//     // { label: 'Connect Wallet', key: 'item-1' },
//     {
//       label: 'Settings',
//       key: 'settingMenu',
//       children: [
//         { label: '[Icon] Dark mode', key: 'settingsDark' },
//         { label: '[Icon] Light mode', key: 'settingsLight' },
//       ],
//     },
//   ]

//   return (
//     <Row justify="space-between">
//       {/* <Col span={10}></Col> */}
//       <Col span={10}>
//         <Menu items={middleItems} mode={'horizontal'} />
//       </Col>
//       {/* <Col>
//       <ConnectMetaMask />
//       </Col> */}
//       <Col span={12}>
//         <Menu items={rightItems} mode={'horizontal'} />
//       </Col>
//     </Row>
//   )
// }

// export default NavBar
