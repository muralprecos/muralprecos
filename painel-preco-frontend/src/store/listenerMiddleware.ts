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

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(clear, add, remove),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "carts",
      JSON.stringify((listenerApi.getState() as RootState).cartReducer)
    )
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(setLabel),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "cotacaoLabelCache",
      JSON.stringify((listenerApi.getState() as RootState).cotacaoLabelCacheReducer)
    )
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
    return localStorage.setItem(
      "tableColumnsPreference",
      JSON.stringify((listenerApi.getState() as RootState).tableColumnsPreferenceReducer)
    )
  }
});
