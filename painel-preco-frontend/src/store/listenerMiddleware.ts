import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { add, clear, remove } from "./features/cart-slice";
import { setLabel } from "./features/cotacao-label-cache-slice";

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
