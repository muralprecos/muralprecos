
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
}

export const useAuthLogout = ({
  callbackUrl = '/',
  redirect = true
} : IAuthLogout) => {
  const router = useRouter();

  const logout = () => {
    return keycloakSessionLogOut()
      .then((ok: boolean) => {
        console.log('done logout', redirect, callbackUrl)
        if (ok) {
          signOut(redirect ? { callbackUrl } : {});
        } else {
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