import Web3 from 'web3'
// import from truffle_abis if deployed through truffle
// import Multiswap from '../truffle_abis/Multiswap.json'

// import from utils if deployed through remix
import Multiswap from '../utils/deployedContractsABI/goerliABI.json'

const initialState = {
  address: '',
  walletConnected: false,
  // chain: 'ftm',
  chain: 'goerli',
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

const attemptToConnectWallet = () => {
  return async (dispatch) => {
    ///
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed
      const web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()
      await dispatch(connectWalletAction({ address: accounts[0], web3: web3 }))
      const networkId = await web3.eth.net.getId()
      console.log(networkId)

      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through truffle
      // load the Multiswap Contract
      /*
      const multiswapData = Multiswap.networks[networkId]
      console.log(multiswapData)
      if (multiswapData) {
        console.log(multiswapData.address)
        // Note, in the future, once deployed to blockchain, need to replace this with the actual address
        const multiswap = new web3.eth.Contract(
          Multiswap.abi,
          multiswapData.address,
        )
      */
      // ******

      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through remix
      if (true) {
        const multiswap = new web3.eth.Contract(
          Multiswap,
          '0x743EaA47beaC140B1ff8d7b14C92A757A0dFAbF4',
        )
        // ******

        console.log(multiswap)
        dispatch(connectSmartContractAction(multiswap))
      } else {
        // if no network...
        console.log('Error: no network detected')
      }
    } catch (error) {
      console.log(error)
      dispatch(disconnectWalletAction())
    }

    ///
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
}

// // import Web3 from 'web3';

// const initialState = {
//   address: '',
//   walletConnected: false,
//   chain: 'ftm',
//   // chain: 'eth'
// }

// // actions here
// const connectWalletAction = (payload) => ({
//   type: 'CONNECTWALLET',
//   payload,
// })

// const changeWalletAction = (payload) => ({
//   type: 'CHANGEWALLET',
//   payload,
// })

// const disconnectWalletAction = () => ({
//   type: 'DISCONNECTWALLET',
// })

// // reducer here
// const connectWalletReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'CONNECTWALLET':
//       return { ...state, address: action.payload, walletConnected: true }
//     case 'CHANGEWALLET':
//       return { ...state, address: action.payload, walletConnected: true }
//     case 'DISCONNECTWALLET':
//       return { ...state, address: '', walletConnected: false }
//     default:
//       return state
//   }
// }

// export {
//   connectWalletReducer,
//   connectWalletAction,
//   changeWalletAction,
//   disconnectWalletAction,
// }
