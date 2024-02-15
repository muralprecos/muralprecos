
import { addSnackError } from "@/utils/snackbarUtils";
import { signOut } from "next-auth/react";
import { EnqueueSnackbar } from "notistack";

async function keycloakSessionLogOut(): Promise<boolean> {
  try {
    const res = await fetch(`/api/auth/logout`, { method: "GET" });
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

export interface IAuthLogout {
  redirect?: boolean
  callbackUrl?: string
  enqueueSnackbar?: EnqueueSnackbar
  forceLogout?: boolean //independente do retorno do keycloak (/api/auth/logout), remover dados do usuário da sessão
}

export const useAuthLogout = ({
  callbackUrl = '/',
  redirect = true,
  enqueueSnackbar,
  forceLogout = false
} : IAuthLogout) => {

  const logout = () => {
    return keycloakSessionLogOut()
      .then((ok: boolean) => {
        console.log('done logout', ok, redirect, callbackUrl)
        if (ok || forceLogout) {
          signOut(redirect ? { callbackUrl } : {});
        } else {
          if (!!enqueueSnackbar) {
            addSnackError(enqueueSnackbar, 'Não foi possível realizar logout.');
          }
          //TODO: adicionar snack com erro de login
          console.log('ocorreu um problema, tente novamente')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    logout
  }
}