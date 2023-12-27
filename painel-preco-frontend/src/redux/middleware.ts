import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { logIn, logOut } from "./features/auth-slice";
import { add, clear, remove } from "./features/cart-slice";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(logOut, logIn),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "auth",
      JSON.stringify((listenerApi.getState() as RootState).authReducer)
    )
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(clear, add, remove),
  effect: (action, listenerApi) => {
    return localStorage.setItem(
      "cart",
      JSON.stringify((listenerApi.getState() as RootState).cartReducer)
    )
  }
});