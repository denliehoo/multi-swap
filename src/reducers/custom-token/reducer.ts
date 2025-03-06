// 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EBlockchainNetwork } from "../../enum";
import { ICustomToken, ICustomTokenState } from "./interface";

// initial state
const initialState: ICustomTokenState = {
  chain: EBlockchainNetwork.FTM, //might need change this default?
  // chain: 'goerli',
  eth: [],
  ftm: [],
  goerli: [],
};

const customTokenSlice = createSlice({
  name: "customTokenReducer",
  initialState,
  reducers: {
    addCustomToken(state, action: PayloadAction<ICustomToken[]>) {
      state[state.chain] = action.payload;
    },
    // TODO: Should update to remove only one token
    removeCustomToken(state, action: PayloadAction<ICustomToken[]>) {
      state[state.chain] = action.payload;
    },
    removeAllCustomToken(state) {
      state[state.chain] = [];
    },
    changeChainCustomToken(state, action: PayloadAction<EBlockchainNetwork>) {
      state.chain = action.payload;
    },
  },
});

export const {
  addCustomToken,
  removeCustomToken,
  removeAllCustomToken,
  changeChainCustomToken,
} = customTokenSlice.actions;

export default customTokenSlice.reducer;

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
