import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { customTokenReducer } from "../reducers/customTokenReducer";
import { swapReducer } from "../reducers/swapReducer";

const persistConfig = {
  key: "root",
  storage, // ??
  whitelist: ["customTokenReducer"], // only state for counterReducer will be whitelisted
};

const rootReducer = combineReducers({
  customTokenReducer: customTokenReducer,
  swapReducer: swapReducer,
});
const reducer = persistReducer(persistConfig, rootReducer);

let store = createStore(reducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
