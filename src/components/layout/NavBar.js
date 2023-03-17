import classes from './NavBar.module.css'
import { Menu, Drawer, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
} from '../../reducers/connectWalletReducer'
import { useEffect, useState } from 'react'
import { changeChainCustomTokenReducer } from '../../reducers/customTokenReducer'
import fantomLogo from '../../assets/images/fantomLogo.svg'
import IconComponent from '../swap/shared/IconComponent'
import multiswapLogo from '../../assets/images/multiswapLogo.png'
import { useWindowSize } from '../../hooks/useWindowSize'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'

const NavBar = ({
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  changeChainCustomTokenReducer,
  connectSmartContractAction,
  attemptToConnectWallet,
  address,
  walletConnected,
  chain,
}) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const { width } = useWindowSize()
  const openDrawer = () => {
    console.log('show drawer')
    setShowDrawer(true)
  }
  const closeDrawer = () => {
    setShowDrawer(false)
  }

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        await attemptToConnectWallet(chain)
      } else {
        console.log('MetaMask is not installed')
      }
    }

    checkMetaMaskConnection()
    changeChainCustomTokenReducer(chain)
  }, [])

  useEffect(()=>{
    width > 500 && closeDrawer()
  },[width])

  useEffect(() => {
    if (walletConnected && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        changeWalletAction(accounts[0])
      })
      window.ethereum.on('chainChanged', async (chainId) => {
        console.log(`Chain changed to ${chainId}`)
        disconnectWalletAction()
        await attemptToConnectWallet(chain)
      })
    } else {
    }
  }, [walletConnected])

  const connectWalletHandler = async () => {
    if (!walletConnected) {
      await attemptToConnectWallet(chain)
    }
  }

  const addressOrConnectButton = (
    <span>
      {address ? (
        <span>{address.substring(0, 4) + '...' + address.slice(-4)}</span>
      ) : (
        <span onClick={connectWalletHandler}>Connect Wallet</span>
      )}
    </span>
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
      label: (
        <span>
          <IconComponent imgUrl={fantomLogo} size={'small'} /> Fantom
        </span>
      ),
      // label: <span>[Logo] Goerli</span>,
      key: 'networkName',
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
  ]
  return (
    <nav className={classes.navBar}>
      <div className={classes.leftItem}>
        <div
          style={{ fontSize: 'large', paddingTop: '10px', paddingLeft: '30px' }}
        >
          <IconComponent imgUrl={multiswapLogo} size={'small'} />
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
              headerStyle={{border: 0}}
              placement="right"
              onClose={closeDrawer}
              visible={showDrawer}
              width={width}
              closeIcon={<CloseOutlined style={{color: '#86C232'}} />}
            >
              <Menu
              items={rightItems}
              mode={'inline'}
              className={classes.antdMenu}
            />
            </Drawer>
          </>
        ) : (
          <>
            <Menu
              items={rightItems}
              mode={'horizontal'}
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
  changeChainCustomTokenReducer: (payload) =>
    dispatch(changeChainCustomTokenReducer(payload)),
  connectSmartContractAction: (payload) =>
    dispatch(connectSmartContractAction(payload)),
  attemptToConnectWallet: (chain) => dispatch(attemptToConnectWallet(chain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

// import classes from './NavBar.module.css'
// import { Menu, Row, Col } from 'antd'
// import { connect } from 'react-redux'
// import {
//   connectWalletAction,
//   changeWalletAction,
//   disconnectWalletAction,
//   connectSmartContractAction,
//   attemptToConnectWallet,
// } from '../../reducers/connectWalletReducer'
// import { useEffect } from 'react'
// import { changeChainCustomTokenReducer } from '../../reducers/customTokenReducer'
// import fantomLogo from '../../assets/images/fantomLogo.svg'
// import IconComponent from '../swap/shared/IconComponent'
// import multiswapLogo from '../../assets/images/multiswapLogo.png'

// const NavBar = ({
//   connectWalletAction,
//   changeWalletAction,
//   disconnectWalletAction,
//   changeChainCustomTokenReducer,
//   connectSmartContractAction,
//   attemptToConnectWallet,
//   address,
//   walletConnected,
//   chain,
// }) => {
//   useEffect(() => {
//     const checkMetaMaskConnection = async () => {
//       if (window.ethereum) {
//         await attemptToConnectWallet(chain)
//       } else {
//         console.log('MetaMask is not installed')
//       }
//     }

//     checkMetaMaskConnection()
//     changeChainCustomTokenReducer(chain)
//   }, [])

//   useEffect(() => {
//     if (walletConnected && window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts) => {
//         changeWalletAction(accounts[0])
//       })
//       window.ethereum.on('chainChanged', async (chainId) => {
//         console.log(`Chain changed to ${chainId}`)
//         disconnectWalletAction()
//         await attemptToConnectWallet(chain)
//       })
//     } else {
//     }
//   }, [walletConnected])

//   const connectWalletHandler = async () => {
//     if (!walletConnected) {
//       await attemptToConnectWallet(chain)
//     }
//   }

//   // const middleItems = [
//   //   { label: 'Swap', key: 'swap' },
//   //   {
//   //     label: 'DAO',
//   //     key: 'daoMenu',

//   //     children: [
//   //       { label: 'Vote', key: 'daoVote' },
//   //       { label: 'Forum', key: 'daoForum' },
//   //     ],
//   //   },
//   // ]

//   const addressOrConnectButton = (
//     <div>
//       {address ? (
//         <div>{address.substring(0, 4) + '...' + address.slice(-4)}</div>
//       ) : (
//         <div onClick={connectWalletHandler}>Connect Wallet</div>
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
//       label: (
//         <span>
//           <IconComponent imgUrl={fantomLogo} size={'small'} /> Fantom
//         </span>
//       ),
//       // label: <span>[Logo] Goerli</span>,
//       key: 'networkName',
//       // children: [
//       //   { label: '[Logo] Goerli', key: 'goerli' },
//       //   { label: '[Logo] Avalanche', key: 'avax' },
//       // ],
//     },
//     walletConnectPortion,
//     // {
//     //   label: 'Settings',
//     //   key: 'settingMenu',
//     //   children: [
//     //     { label: '[Icon] Dark mode', key: 'settingsDark' },
//     //     { label: '[Icon] Light mode', key: 'settingsLight' },
//     //   ],
//     // },
//   ]

//   return (
//     <Row justify="space-between">
//       <Col
//         style={{ fontSize: 'large', paddingTop: '10px', paddingLeft: '30px' }}
//       >
//         <IconComponent imgUrl={multiswapLogo} size={'small'} />
//         Multiswap
//       </Col>
//       <Col>
//         <Menu
//           items={rightItems}
//           mode={'horizontal'}
//           className={classes.navbar}
//         />
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
//   changeChainCustomTokenReducer: (payload) =>
//     dispatch(changeChainCustomTokenReducer(payload)),
//   connectSmartContractAction: (payload) =>
//     dispatch(connectSmartContractAction(payload)),
//   attemptToConnectWallet: (chain) => dispatch(attemptToConnectWallet(chain)),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
