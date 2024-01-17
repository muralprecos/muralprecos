import { AnyAction, configureStore } from '@reduxjs/toolkit'
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from "react-redux";
import { listenerMiddleware } from "./middleware";
import { isClientNextjs } from '@/utils/validateUtils';

import authReducer, { initialState as authInitialState } from './features/auth-slice'
import cartReducer, { initialState as cartInitialState } from './features/cart-slice'
import cotacaoSearchReducer, { initialState as cotacaoSearchInitialState } from './features/cotacao-search-slice'

const authState = isClientNextjs() ? JSON.parse(localStorage.getItem("auth") || "null") : null;
const cartState = isClientNextjs() ? JSON.parse(localStorage.getItem("cart") || "null") : null;
const cotacaoSearchState = isClientNextjs() ? JSON.parse(localStorage.getItem("cotacaoSearch") || "null") : null;

export const store = configureStore({
  preloadedState: {
    authReducer: authState === null ? authInitialState : authState,
    cartReducer: cartState === null ? cartInitialState : cartState,
    cotacaoSearchReducer: cotacaoSearchState === null ? cotacaoSearchInitialState : cotacaoSearchState,
  },
  reducer: {
    authReducer,
    cartReducer,
    cotacaoSearchReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type Action = AnyAction;

export const useDispatch: () => AppDispatch = _useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = _useSelector;
export default store;
