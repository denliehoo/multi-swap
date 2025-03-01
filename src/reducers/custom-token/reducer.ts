// 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
// actions

import { EBlockchainNetwork } from "../../enum";
import { ECustomTokenAction } from "./action";
import { ICustomTokenState } from "./interface";

// initial state
const initialState: ICustomTokenState = {
  chain: EBlockchainNetwork.FTM, //might need change this default?
  // chain: 'goerli',
  eth: [],
  ftm: [],
  goerli: [],
};

// the reducer
const customTokenReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ECustomTokenAction.ADD_CUSTOM_TOKEN:
      return { ...state, [state.chain]: action.payload };
    case ECustomTokenAction.REMOVE_CUSTOM_TOKEN:
      return { ...state, [state.chain]: action.payload };
    case ECustomTokenAction.REMOVE_ALL_CUSTOM_TOKEN:
      return { ...state, [state.chain]: [] };
    case ECustomTokenAction.CHANGE_CHAIN:
      return { ...state, chain: action.payload };
    default:
      return state;
  }
};

// export the actions and the reducer
export { customTokenReducer };

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
