import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { logIn, logOut } from "./features/auth-slice";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(logOut, logIn),
  effect: (action, listenerApi) => {
    console.log('listenerMiddleware', action, listenerApi)
    return localStorage.setItem(
      "auth",
      JSON.stringify((listenerApi.getState() as RootState).authReducer)
    )
  }
});
