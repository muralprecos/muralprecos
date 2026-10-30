import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { add, clear, remove } from "./features/cart-slice";
import { setLabel } from "./features/cotacao-label-cache-slice";
import {
  resetUserColumnsPreference,
  setShowLocalizacao,
  setShowQuantidade,
  setShowUnidade,
  setShowValorTotal,
} from "./features/table-columns-slice";
import { setSessionData, clearSessionData } from "./features/session-slice";
import { storageService } from "@/services/StorageService";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(clear, add, remove),
  effect: (action, listenerApi) => {
    storageService.setItem(
      "carts",
      (listenerApi.getState() as RootState).cartReducer
    );
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(setLabel),
  effect: (action, listenerApi) => {
    storageService.setItem(
      "cotacaoLabelCache",
      (listenerApi.getState() as RootState).cotacaoLabelCacheReducer
    );
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(
    setShowUnidade,
    setShowQuantidade,
    setShowValorTotal,
    setShowLocalizacao,
    resetUserColumnsPreference
  ),
  effect: (action, listenerApi) => {
    storageService.setItem(
      "tableColumnsPreference",
      (listenerApi.getState() as RootState).tableColumnsPreferenceReducer
    );
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(setSessionData, clearSessionData),
  effect: (action, listenerApi) => {
    storageService.setItem(
      "userSessionCache",
      (listenerApi.getState() as RootState).sessionReducer
    );
  }
});
