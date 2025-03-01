import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { customTokenReducer } from "../reducers/custom-token/reducer";
import { swapReducer } from "../reducers/swap/reducer";
import { connectWalletReducer } from "../reducers/connect-wallet";

const persistConfig = {
  key: "root",
  storage, // ??
  whitelist: ["customTokenReducer"], // only state for counterReducer will be whitelisted
};

const rootReducer = combineReducers({
  customTokenReducer: customTokenReducer,
  swapReducer: swapReducer,
  connectWalletReducer: connectWalletReducer,
});
const reducer = persistReducer(persistConfig, rootReducer);

let store = createStore(reducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
