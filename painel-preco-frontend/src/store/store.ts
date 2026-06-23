import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { listenerMiddleware } from './listenerMiddleware';
import { isClientNextjs } from '@/utils/validateUtils';

import cartReducer, { initialState as cartInitialState } from './features/cart-slice';
import cotacaoLabelCacheReducer, { cotacaoLabelCacheInitialState } from './features/cotacao-label-cache-slice';
import tableColumnsPreferenceReducer, {
  tableColumnsPreferenceInitialState,
  TableColumnsPreferenceState,
} from './features/table-columns-slice';
import { ICart } from '@/interfaces/types';

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
const cotacaoLabelCacheState = loadFromLocalStorage('cotacaoLabelCache', cotacaoLabelCacheInitialState);
const tableColumnsPreferenceState = loadFromLocalStorage<TableColumnsPreferenceState>(
  'tableColumnsPreference',
  tableColumnsPreferenceInitialState
);

export const store = configureStore({
  preloadedState: {
    cartReducer: cartState,
    cotacaoLabelCacheReducer: cotacaoLabelCacheState,
    tableColumnsPreferenceReducer: tableColumnsPreferenceState,
  },
  reducer: {
    cartReducer,
    cotacaoLabelCacheReducer,
    tableColumnsPreferenceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

