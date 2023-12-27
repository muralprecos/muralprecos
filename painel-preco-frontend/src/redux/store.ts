import { AnyAction, configureStore } from '@reduxjs/toolkit'
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from "react-redux";
import { listenerMiddleware } from "./middleware";
import authReducer, { authInitialState } from './features/auth-slice'
import { verifyIsOnlyClientNextjs } from '@/utils/validateUtils';

let authState = null;
if (verifyIsOnlyClientNextjs()) {
  authState = JSON.parse(localStorage.getItem("auth") || "null");
}

export const store = configureStore({
  preloadedState: {
    authReducer: authState === null ? authInitialState : authState
  },
  reducer: {
    authReducer
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
