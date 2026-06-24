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

import sessionReducer, { sessionInitialState, SessionState } from './features/session-slice';
import { storageService } from '@/services/StorageService';

const cartState = storageService.getItem<"carts", ICart>('carts', cartInitialState);
const cotacaoLabelCacheState = storageService.getItem('cotacaoLabelCache', cotacaoLabelCacheInitialState);
const tableColumnsPreferenceState = storageService.getItem<"tableColumnsPreference", TableColumnsPreferenceState>(
  'tableColumnsPreference',
  tableColumnsPreferenceInitialState
);
const sessionState = storageService.getItem<"userSessionCache", SessionState>(
  'userSessionCache',
  sessionInitialState
);

export const store = configureStore({
  preloadedState: {
    cartReducer: cartState,
    cotacaoLabelCacheReducer: cotacaoLabelCacheState,
    tableColumnsPreferenceReducer: tableColumnsPreferenceState,
    sessionReducer: sessionState,
  },
  reducer: {
    cartReducer,
    cotacaoLabelCacheReducer,
    tableColumnsPreferenceReducer,
    sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

