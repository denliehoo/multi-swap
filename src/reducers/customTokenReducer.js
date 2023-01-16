// 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
// actions
const addCustomToken = (payload) => ({
  type: 'ADD_CUSTOM_TOKEN',
  payload,
})

const removeCustomToken = (payload) => ({
  type: 'REMOVE_CUSTOM_TOKEN',
  payload,
})
const removeAllCustomToken = (payload) => ({
  type: 'REMOVE_ALL_CUSTOM_TOKEN',
  payload,
})

const changeChain = (payload) => ({
  type: 'CHANGE_CHAIN',
  payload,
})

// initial state
const initialState = {
  chain: 'ftm', //might need change this default?
  eth: [],
  ftm: [],
}

// the reducer
const customTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CUSTOM_TOKEN':
      return { ...state, [state.chain]: action.payload }
    case 'REMOVE_CUSTOM_TOKEN':
      return { ...state, [state.chain]: action.payload }
    case 'REMOVE_ALL_CUSTOM_TOKEN':
      return { ...state, [state.chain]: action.payload }
    case 'CHANGE_CHAIN':
      return { ...state, chain: action.payload }
    default:
      return state
  }
}

// export the actions and the reducer
export {
  addCustomToken,
  removeCustomToken,
  removeAllCustomToken,
  changeChain,
  customTokenReducer,
}

/* state becomes this eventually
structure would be:
{
    chain: [{name, symbol, decimals, logol, address}, {name, symbol, decimals, logol, address},... ],
    chain2: [{name, symbol, decimals, logol, address}, {name, symbol, decimals, logol, address},... ],
}
e.g.
const initialState = {
    eth: [
        {
            name: name,
            symbol: symbol,
            decimals: decimals,
            logo: logo,
            address: tokenAddress
        }
    ],
  ropsten: [{}]
}; 
Note: when new chain is added, remember to clear cookies / restart laptop.
Else the new chain will probably result in "undefined", this is likely due to the persist state
*/
