import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customTokenReducer from '../reducers/custom-token/reducer';
import connectWalletReducer from '../reducers/connect-wallet/reducer';
import swapReducer from '../reducers/swap/reducer';

const persistConfig = {
  key: 'root',
  storage, // ??
  whitelist: ['customTokenReducer'], // only state for counterReducer will be whitelisted
};

const rootReducer = combineReducers({
  customTokenReducer: customTokenReducer,
  swapReducer: swapReducer,
  connectWalletReducer: connectWalletReducer,
});
const reducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
