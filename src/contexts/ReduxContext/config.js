import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { createTransform, persistStore } from "redux-persist"
import persistReducer from "redux-persist/es/persistReducer"
import mainSlice from "./reducers/mainSlice"
import loanSlice from './reducers/loan'
import storage from "redux-persist/lib/storage"
import { stringify, parse } from "flatted"

const reducers = combineReducers({
  main: mainSlice,
  loan: loanSlice
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState)
);

const persistConfig = {
  key: "dbk-load-store",
  version: 1,
  storage,
  tranforms: [],
  // whitelist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [],
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
