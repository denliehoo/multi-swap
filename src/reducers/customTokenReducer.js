// actions
const addCustomToken = (payload) => ({
    type: "ADD_CUSTOM_TOKEN", payload
})
const removeCustomToken = (payload) => ({
    type: "REMOVE_CUSTOM_TOKEN", payload
})
const removeAllCustomToken = (payload) => ({
    type: "REMOVE_ALL_CUSTOM_TOKEN", payload
})

// initial state
const initialState = {
    eth: []
};

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
}; */


// the reducer
const customTokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CUSTOM_TOKEN":
            return { ...state, eth: action.payload };
        case "REMOVE_CUSTOM_TOKEN":
            return { ...state, eth: action.payload };
        case "REMOVE_ALL_CUSTOM_TOKEN":
            return { ...state, eth: action.payload };

        default:
            return state;
    }
};

// export the actions and the reducer
export { addCustomToken, removeCustomToken, removeAllCustomToken, customTokenReducer };
