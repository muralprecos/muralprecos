import { getAccessTokenClient } from "@/utils/sessionTokenAccessor";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function getToken() {
      const accessToken = await getAccessTokenClient(session);
      setToken(accessToken);
    }
    getToken();
  }, [session]);

  useEffect(() => {
    if (status == "unauthenticated" || (status != "loading" && !!session && session.error === "RefreshAccessTokenError")) {
      console.log('1 - unauthenticated')
      setAuthStatus("unauthenticated");
      if (currentPathname != URL.LOGIN) {
        router.push(URL.LOGIN);
        router.refresh();
      }
    } else if (status == "authenticated" && !session.roles?.includes("admin")) {
      console.log('2 - unauthorized')
      setAuthStatus("unauthorized");
      router.push(URL.UNAUTHORIZED);
      router.refresh();
    } else {
      console.log('3 - ', status)
      setAuthStatus(status);
    }
  }, [session, status, router, URL.LOGIN, URL.UNAUTHORIZED, currentPathname]);

  return {
    token,
    session,
    status: authStatus
  };
};