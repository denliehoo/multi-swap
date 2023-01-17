const initialState = {
  address: '',
  walletConnected: false,
  chain: 'ftm',
  // chain: 'eth'
  multiswap: {}
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

const connectSmartContractAction = (payload) =>({
  type: 'CONNECTSMARTCONTRACT',
  payload
})

// reducer here
const connectWalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTWALLET':
      return { ...state, address: action.payload, walletConnected: true }
    case 'CHANGEWALLET':
      return { ...state, address: action.payload, walletConnected: true }
    case 'DISCONNECTWALLET':
      return { ...state, address: '', walletConnected: false, multiswap: {} }
    case 'CONNECTSMARTCONTRACT':
      return {...state, multiswap: action.payload}
    default:
      return state
  }
}

export {
  connectWalletReducer,
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction
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
