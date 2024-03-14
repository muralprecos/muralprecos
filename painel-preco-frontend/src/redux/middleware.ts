import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { add, clear, remove } from "./features/cart-slice";
import { clearForm, doSearch } from "./features/cotacao-search-slice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(clear, add, remove),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "cart",
      JSON.stringify((listenerApi.getState() as RootState).cartReducer)
    )
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(clearForm, doSearch),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "cotacaoSearch",
      JSON.stringify((listenerApi.getState() as RootState).cotacaoSearchReducer)
    )
  }
});