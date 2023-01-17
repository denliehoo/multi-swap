// import classes from "./NavBar.module.css";
import { Menu, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
} from '../../reducers/connectWalletReducer'
import { useEffect } from 'react'
import Web3 from 'web3'
import { changeChain } from '../../reducers/customTokenReducer'
import Multiswap from '../../truffle_abis/Multiswap.json'

const NavBar = ({
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  changeChainAction,
  connectSmartContractAction,
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

  const attemptToConnectWallet = async () => {
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed
      const web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()
      connectWalletAction(accounts[0])
      const networkId = await web3.eth.net.getId()
      console.log(networkId)
      // load the Multiswap Contract
      const multiswapData = Multiswap.networks[networkId]
      console.log(multiswapData)
      if (multiswapData) {
        console.log(multiswapData.address)
        // Note, in the future, once deployed to blockchain, need to replace this with the actual address
        const multiswap = new web3.eth.Contract(
          Multiswap.abi,
          multiswapData.address,
        )
        console.log(multiswap)
        connectSmartContractAction(multiswap)
      } else {
        // if no network...
        console.log('Error: no network detected')
      }
    } catch (error) {
      console.log(error)
      disconnectWalletAction()
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
  connectSmartContractAction: (payload) =>
    dispatch(connectSmartContractAction(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

// ** before refactor
// import classes from "./NavBar.module.css";
// import { Menu, Row, Col } from 'antd'
// import { connect } from 'react-redux'
// import {
//   connectWalletAction,
//   changeWalletAction,
//   disconnectWalletAction,
// } from '../../reducers/connectWalletReducer'
// import { useEffect } from 'react'
// import Web3 from 'web3'
// import { changeChain } from '../../reducers/customTokenReducer'
// import Multiswap from "../../truffle_abis/Multiswap.json"

// const NavBar = ({
//   connectWalletAction,
//   changeWalletAction,
//   disconnectWalletAction,
//   changeChainAction,
//   address,
//   walletConnected,
//   chain,
// }) => {
//   useEffect(() => {
//     const checkMetaMaskConnection = async () => {
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum)
//         try {
//           // Request account access if needed
//           await window.ethereum.enable()
//           // Acccounts now exposed
//           const accounts = await web3.eth.getAccounts()
//           connectWalletAction(accounts[0])
//           //  **** this needs to be copied below too; or just refactor the top part also is fine
//           const networkId = await web3.eth.net.getId()
//           console.log(networkId)
//           // load the Multiswap Contract
//           const multiswapData = Multiswap.networks[networkId]
//           console.log(multiswapData)
//           if (multiswapData) {
//             // Note, in the future, once deployed to blockchain, need to replace this with the actual address
//             const multiswap = new web3.eth.Contract(Multiswap.abi, multiswapData.address)
//             console.log(multiswap)
//             // now push multiswap to store or something

//         } else { // if no network...
//             console.log("Error: no network detected")
//         }

//           // **** end of the copy

//         } catch (error) {
//           console.log(error)
//           disconnectWalletAction()
//         }
//       } else {
//         console.log('MetaMask is not installed')
//       }
//     }

//     checkMetaMaskConnection()
//     changeChainAction(chain)
//   }, [])

//   useEffect(() => {
//     if (walletConnected && window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts) => {
//         changeWalletAction(accounts[0])
//       })
//     } else {
//     }
//   }, [walletConnected])

//   const handleConnect = async () => {
//     if (!walletConnected) {
//       try {
//         // Request account access if needed
//         await window.ethereum.enable()
//         // Acccounts now exposed
//         const web3 = new Web3(window.ethereum)
//         const accounts = await web3.eth.getAccounts()
//         connectWalletAction(accounts[0])
//       } catch (error) {
//         console.log(error)
//         disconnectWalletAction()
//       }
//     }
//   }

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

//   const addressOrConnectButton = (
//     <div>
//       {address ? (
//         <div>{address.substring(0, 4) + '...' + address.slice(-4)}</div>
//       ) : (
//         <div onClick={handleConnect}>Connect Wallet</div>
//       )}
//     </div>
//   )

//   const walletConnectPortion =
//     walletConnected && address
//       ? {
//           label: addressOrConnectButton,
//           key: 'connectWallet',
//           children: [
//             {
//               label: <div onClick={disconnectWalletAction}>Disconnect</div>,
//               key: 'disconnectWallet',
//             },
//           ],
//         }
//       : { label: addressOrConnectButton, key: 'connectWallet' }

//   const rightItems = [
//     {
//       label: '[Logo] Fantom',
//       key: 'ftm',
//       children: [
//         { label: '[Logo] Ethereum', key: 'eth' },
//         { label: '[Logo] Avalanche', key: 'avax' },
//       ],
//     },
//     walletConnectPortion,
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
//       <Col span={10}>
//         <Menu items={middleItems} mode={'horizontal'} />
//       </Col>

//       <Col span={12}>
//         <Menu items={rightItems} mode={'horizontal'} />
//       </Col>
//     </Row>
//   )
// }

// const mapStateToProps = ({ connectWalletReducer }) => ({
//   address: connectWalletReducer.address,
//   walletConnected: connectWalletReducer.walletConnected,
//   chain: connectWalletReducer.chain,
// })

// const mapDispatchToProps = (dispatch) => ({
//   connectWalletAction: (payload) => dispatch(connectWalletAction(payload)),
//   changeWalletAction: (payload) => dispatch(changeWalletAction(payload)),
//   disconnectWalletAction: () => dispatch(disconnectWalletAction()),
//   changeChainAction: (payload) => dispatch(changeChain(payload)),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
