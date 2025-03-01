import { ISwapState } from "./interface";

const INITAL_SWAP_FROM = [
  {
    index: 0,
    symbol: "",
    address: "",
    balance: 0,
    amount: 0,
    decimals: 0,
    imgUrl: "",
  },
];

const INITAL_SWAP_TO = [
  {
    index: 0,
    symbol: "",
    address: "",
    balance: 0,
    amount: 100,
    decimals: 0,
    imgUrl: "",
  },
];

// initial state
const initialState: ISwapState = {
  swapFrom: INITAL_SWAP_FROM,
  swapTo: INITAL_SWAP_TO,
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
        swapFrom: INITAL_SWAP_FROM,
        swapTo: INITAL_SWAP_TO,
      };
    default:
      return state;
  }
};

// export the actions and the reducer
export { swapReducer };
