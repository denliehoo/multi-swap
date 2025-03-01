import axios from "axios";

/*
https://github.com/denliehoo/crypto-tracker/blob/main/client/src/pages/marketPrice/MarketDataPage.tsx
https://github.com/denliehoo/crypto-tracker/blob/main/client/src/store/coins-context.tsx
*/

//actions
const changeToLoading = () => ({ type: "CHANGETOLOADING" });
const getCoinsHandler = (payload: any) => ({
  type: "GETCOINS",
  payload,
});
const getCoins = () => {
  return async (dispatch: any) => {
    dispatch(changeToLoading()); // changes isLoading to true
    const res = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    const coinNameHolder = await res.data.map((i: any) => {
      coinNameHolder[i.symbol] = i.id;
      return;
    });
    const coinTickerArrayHolder = res.data.map((i: any) => {
      return i.symbol.toUpperCase();
    });
    await dispatch(
      getCoinsHandler({
        coinName: coinNameHolder,
        coinTickerArray: coinTickerArrayHolder,
      })
    ); // gets the coins and set isLoading to false(in the reducer)
  };
};

// initial state
const initialState = {
  isLoading: false, // used for displaying the "Loading" on frontend
  coinName: {}, // stores an object {..,btc: "bitcoin",... "xrp":ripple,...}
  coinTickerArray: [], //stores a list of all the tickers available [....,"ada",..."btc",..."xrp"...]
};

// the reducer
const getCoinsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "GETCOINS":
      return {
        ...state,
        coinName: action.payload.coinName,
        coinTickerArray: action.payload.coinTickerArray,
        isLoading: false,
      };
    case "CHANGETOLOADING":
      return { ...state, isLoading: true };

    default:
      return state;
  }
};

export { getCoins, getCoinsReducer };
