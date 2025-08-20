import { combineReducers, configureStore } from '@reduxjs/toolkit';
import customTokenReducer from '../reducers/custom-token/reducer';
import connectWalletReducer from '../reducers/connect-wallet/reducer';
import swapReducer from '../reducers/swap/reducer';

const rootReducer = combineReducers({
  customTokenReducer: customTokenReducer,
  swapReducer: swapReducer,
  connectWalletReducer: connectWalletReducer,
});
const reducer = rootReducer;

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
