import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { listenerMiddleware } from './listenerMiddleware';
import { isClientNextjs } from '@/utils/validateUtils';

import cartReducer, { initialState as cartInitialState } from './features/cart-slice';
import cotacaoSearchReducer, { initialState as cotacaoSearchInitialState } from './features/cotacao-search-slice';
import { ICart } from '@/interfaces/types';

// Função segura para recuperar estado do localStorage
function loadFromLocalStorage<T>(key: string, fallback: T): T {
  if (!isClientNextjs()) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (err) {
    console.warn(`Erro ao carregar ${key} do localStorage`, err);
    return fallback;
  }
}

const cartState = loadFromLocalStorage<ICart>('carts', cartInitialState);
const cotacaoSearchState = loadFromLocalStorage('cotacaoSearch', cotacaoSearchInitialState);

export const store = configureStore({
  preloadedState: {
    cartReducer: cartState,
    cotacaoSearchReducer: cotacaoSearchState,
  },
  reducer: {
    cartReducer,
    cotacaoSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

// Tipos globais
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
