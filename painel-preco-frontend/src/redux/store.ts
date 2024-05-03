import { AnyAction, configureStore } from '@reduxjs/toolkit'
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from "react-redux";
import { listenerMiddleware } from "./middleware";
import { isClientNextjs } from '@/utils/validateUtils';

import cartReducer, { initialState as cartInitialState } from './features/cart-slice'
import cotacaoSearchReducer, { initialState as cotacaoSearchInitialState } from './features/cotacao-search-slice'
import { ICart } from '@/interfaces/types';

const cartState = isClientNextjs() ? JSON.parse(localStorage.getItem("carts") || "null") as ICart : null;
const cotacaoSearchState = isClientNextjs() ? JSON.parse(localStorage.getItem("cotacaoSearch") || "null") : null;

export const store = configureStore({
  preloadedState: {
    cartReducer: cartState === null ? cartInitialState : cartState,
    cotacaoSearchReducer: cotacaoSearchState === null ? cotacaoSearchInitialState : cotacaoSearchState,
  },
  reducer: {
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
