// import Web3 from 'web3';

const initialState = {
    address: '',
    walletConnected: false,
    chain: 'eth'
}

// actions here
const connectWalletAction = (payload) =>({
    type: "CONNECTWALLET",
    payload
})

const changeWalletAction = (payload) =>({
    type: "CHANGEWALLET",
    payload
})

const disconnectWalletAction = () =>({
    type: "DISCONNECTWALLET",
})

// reducer here
const connectWalletReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONNECTWALLET':
            return {...state, address: action.payload, walletConnected: true}
        case 'CHANGEWALLET':
            return {...state, address: action.payload, walletConnected: true}
        case 'DISCONNECTWALLET':
            return {...state, address: '', walletConnected: false}
        default:
            return state
    }
}

export { connectWalletReducer, connectWalletAction, changeWalletAction, disconnectWalletAction  };
