import { getAccessTokenClient } from "@/utils/sessionTokenAccessor";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthLogout } from "./useAuthLogout";
import { hasString } from "@/utils/validateUtils";

type IStatusAuth = "authenticated" | "loading" | "unauthenticated" | "unauthorized";

export interface IAuthHookReturn {
  token: string|null
  session: Session|null
  status: IStatusAuth
}

export const useAuthCheck = () : IAuthHookReturn => {

  const URL = {
    LOGIN: "/login",
    UNAUTHORIZED: "/unauthorized"
  };

  const router = useRouter();
  const currentPathname = usePathname();
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string|null>(null);
  const [authStatus, setAuthStatus] = useState<IStatusAuth>(status);

  const { logout } = useAuthLogout({redirect: false, forceLogout: true});

  useEffect(() => {
    async function getToken() {
      const accessToken = await getAccessTokenClient(session);
      setToken(accessToken);
    }
    getToken();
  }, [session]);

  useEffect(() => {
    const sesErr = session?.error || '';
    //TODO: implementar regra de check de permissões
    if (status == "unauthenticated") {
      setAuthStatus("unauthenticated");
      if (hasString(token) || hasString(sesErr)) {
        console.log('REDIRECT: unauthenticated com token')
        logout();
      } else if (currentPathname != URL.LOGIN) {
        console.log('REDIRECT: unauthenticated fora do login')
        router.push(URL.LOGIN);
        router.refresh();
      }
    } else {
      setAuthStatus(status);
    }
  }, [session, status, router, URL.LOGIN, URL.UNAUTHORIZED, currentPathname, logout, token]);

  return {
    token,
    session,
    status: authStatus
  };
};