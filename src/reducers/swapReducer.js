// actions
const addSwapFrom = (payload) => ({
  type: 'ADD_SWAP_FROM',
  payload,
})
const removeSwapFrom = (payload) => ({
  type: 'REMOVE_SWAP_FROM',
  payload,
})
const addSwapTo = (payload) => ({
  type: 'ADD_SWAP_TO',
  payload,
})
const removeSwapTo = (payload) => ({
  type: 'REMOVE_SWAP_TO',
  payload,
})
// initial state
const initialState = {
  swapFrom: [
    {
      index: 0,
      symbol: '',
      address: '',
      balance: 0,
      amount: '',
    },
  ],
  swapTo: [
    {
      index: 0,
      symbol: '',
      address: '',
      balance: 0,
      amount: 100,
    },
  ],
}
// const initialState = {
//     swapFrom: [],
//     swapTo: []
// };

/* state becomes this eventually
structure would be:
{
    swapFrom:[
        {asset: 'ETH', amount: 0.10 },{....}
    ],
    swapTo:[
        {...},{...}
    ]
}
*/

// the reducer
const swapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SWAP_FROM':
      return { ...state, swapFrom: action.payload }
    case 'REMOVE_SWAP_FROM':
      return { ...state, swapFrom: action.payload }
    case 'ADD_SWAP_TO':
      return { ...state, swapTo: action.payload }
    case 'REMOVE_SWAP_TO':
      return { ...state, swapTo: action.payload }
    default:
      return state
  }
}

// export the actions and the reducer
export { addSwapFrom, removeSwapFrom, addSwapTo, removeSwapTo, swapReducer }
