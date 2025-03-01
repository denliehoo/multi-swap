// actions
const addSwapFrom = (payload: any) => ({
  type: "ADD_SWAP_FROM",
  payload,
});
const removeSwapFrom = (payload: any) => ({
  type: "REMOVE_SWAP_FROM",
  payload,
});
const addSwapTo = (payload: any) => ({
  type: "ADD_SWAP_TO",
  payload,
});
const removeSwapTo = (payload: any) => ({
  type: "REMOVE_SWAP_TO",
  payload,
});
const resetSwap = () => ({
  type: "RESET_SWAP",
});
// initial state
const initialState = {
  swapFrom: [
    {
      index: 0,
      symbol: "",
      address: "",
      balance: 0,
      amount: "",
      decimals: 0,
      imgUrl: "",
    },
  ],
  swapTo: [
    {
      index: 0,
      symbol: "",
      address: "",
      balance: 0,
      amount: 100,
      decimals: 0,
      imgUrl: "",
    },
  ],
};
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
const swapReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ADD_SWAP_FROM":
      return { ...state, swapFrom: action.payload };
    case "REMOVE_SWAP_FROM":
      return { ...state, swapFrom: action.payload };
    case "ADD_SWAP_TO":
      return { ...state, swapTo: action.payload };
    case "REMOVE_SWAP_TO":
      return { ...state, swapTo: action.payload };
    case "RESET_SWAP":
      return {
        swapFrom: [
          {
            index: 0,
            symbol: "",
            address: "",
            balance: 0,
            amount: "",
            decimals: 0,
            imgUrl: "",
          },
        ],
        swapTo: [
          {
            index: 0,
            symbol: "",
            address: "",
            balance: 0,
            amount: 100,
            decimals: 0,
            imgUrl: "",
          },
        ],
      };
    default:
      return state;
  }
};

// export the actions and the reducer
export {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  swapReducer,
  resetSwap,
};
