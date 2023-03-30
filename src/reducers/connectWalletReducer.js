import Web3 from 'web3'
// import from truffle_abis if deployed through truffle
// import Multiswap from '../truffle_abis/Multiswap.json'

// import from utils if deployed through remix
// import Multiswap from '../utils/deployedContractsABI/goerliABI.json'
// import Multiswap from '../utils/deployedContractsABI/ftmABI.json'
import Multiswap_goerli from '../utils/deployedContractsABI/phase2/goerliABI.json'
import Multiswap_ftm from "../utils/deployedContractsABI/phase2/ftmABI.json"
import { MULTISWAP_ADDRESS } from '../config/config'

// config for chain ids
const chainIds = {
  eth: '0x1',
  ftm: '0xFA',
  goerli: '0x5',
}

const multiswapAbi = {
  goerli: Multiswap_goerli,
  ftm: Multiswap_ftm
}

const chainConfig = {
  //eth:
  // goerli:
  ftm: {
    chainId: '0xFA',
    chainName: 'Fantom',
    rpcUrls: ['https://rpc.ankr.com/fantom'],
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    blockExplorerUrls: ['https://ftmscan.com'],
  },
}

const initialState = {
  address: '',
  walletConnected: false,
  chain: 'ftm',
  // chain: 'goerli',
  // chain: 'eth'
  multiswap: {},
  web3: {},
}

// actions here
const connectWalletAction = (payload) => ({
  type: 'CONNECTWALLET',
  payload,
})

const changeWalletAction = (payload) => ({
  type: 'CHANGEWALLET',
  payload,
})

const disconnectWalletAction = () => ({
  type: 'DISCONNECTWALLET',
})

const connectSmartContractAction = (payload) => ({
  type: 'CONNECTSMARTCONTRACT',
  payload,
})

const changeChainConnectWalletReducer = (payload) => ({
  type: 'CHANGECHAIN',
  payload
})

const attemptToConnectWallet = (chain) => {
  return async (dispatch) => {
    ///
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed
      const web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId() // int type

      console.log("from reducer:")
      console.log(networkId)
      console.log(chain)
      console.log(chainIds[chain])
      
      let onCorrectChain = true;
      // if network id not equal to the goerli, attempt to change chain
      // if connect to ganache instead, think just hardcode chainIds[chain] to that of ganache instead
      if(web3.utils.toHex(networkId) !== chainIds[chain]){
        console.log('on wrong chain')
        // attempt to connect
        onCorrectChain = await attemptToChangeChain(chain)
        console.log(onCorrectChain)
        if(!onCorrectChain){
          dispatch(disconnectWalletAction())
          return false
        }
      }
      console.log('this is happening')
      await dispatch(connectWalletAction({ address: accounts[0], web3: web3 }))


      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through truffle
      // load the Multiswap Contract
      /*
      const multiswapData = Multiswap.networks[networkId]
      console.log(multiswapData)
      if (multiswapData) {
        console.log(multiswapData.address)
        const multiswap = new web3.eth.Contract(
          Multiswap.abi,
          multiswapData.address,
        )
      */
      // ******

      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through remix
      if (onCorrectChain) {
        const multiswap = new web3.eth.Contract(
          multiswapAbi[chain],
          // '0x743EaA47beaC140B1ff8d7b14C92A757A0dFAbF4', // Goerli
          // '0x4e604887d397BB75e064522223c0D56CDD92E990', // FTM
          // '0x6aD14F3770bb85a35706DCa781E003Fcf1e716e3' // phase 2 goerli
          MULTISWAP_ADDRESS[chain]
          )
        // ******

        console.log(multiswap.methods)
        dispatch(connectSmartContractAction(multiswap))
        return true
      } else {
        // if no network...
        console.log('Error: Wrong chain or no network detected')
        dispatch(disconnectWalletAction())
        return false
      }
    } catch (error) {
      console.log(error)
      dispatch(disconnectWalletAction())
      return false
    }

    ///
  }
}

const attemptToChangeChain = async (chain) => {
  // try to switch, if can't switch (either because user reject or dont have the chain id), then will give error
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIds[chain] }],
    })
    return true
  } catch {
    // if user dont have the chain then we add it
    try {
      const results = await window.ethereum.request({
        jsonrpc: '2.0',
        method: 'wallet_addEthereumChain',
        params: [chainConfig[chain]],
        id: 0,
      })

      if (!results) return false
      return true

    } catch {
      console.log('User rejected')
      return false
      // maybe change address here or something to unsupported? Will this cause any problems?
    }
  }
}

// reducer here
const connectWalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTWALLET':
      return {
        ...state,
        address: action.payload.address,
        web3: action.payload.web3,
        walletConnected: true,
      }
    case 'CHANGEWALLET':
      return { ...state, address: action.payload, walletConnected: true }
    case 'DISCONNECTWALLET':
      return { ...state, address: '', walletConnected: false, multiswap: {} }
    case 'CONNECTSMARTCONTRACT':
      return { ...state, multiswap: action.payload }
    case 'CHANGECHAIN':
      return {...state, chain: action.payload}
    default:
      return state
  }
}

export {
  connectWalletReducer,
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer
}