import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISwapDetails, ISwapState } from "./interface";

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

const swapSlice = createSlice({
  name: "swapReducer",
  initialState,
  reducers: {
    addSwapFrom(state, action: PayloadAction<ISwapDetails[]>) {
      state.swapFrom = action.payload;
    },
    removeSwapFrom(state, action: PayloadAction<ISwapDetails[]>) {
      state.swapFrom = action.payload;
    },
    addSwapTo(state, action: PayloadAction<ISwapDetails[]>) {
      state.swapTo = action.payload;
    },
    removeSwapTo(state, action: PayloadAction<ISwapDetails[]>) {
      state.swapTo = action.payload;
    },
    resetSwap(state) {
      state.swapFrom = INITAL_SWAP_FROM;
      state.swapTo = INITAL_SWAP_TO;
    },
  },
});

export const {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  resetSwap,
} = swapSlice.actions;

export default swapSlice.reducer;
