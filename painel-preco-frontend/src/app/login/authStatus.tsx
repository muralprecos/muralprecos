"use client";

import { decrypt } from "@/utils/encryption";
import { useSession, signIn, signOut } from "next-auth/react";
import { ReactElement, useEffect } from "react";

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
const AuthStatus: React.FC = () => {

  const { data: session, status } = useSession(); 

  console.log('AuthStatus', session, status)

  useEffect(() => {
    if (
      status != "loading" &&
      session && session?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);


  if (status == "loading") {
    return <div>Loading...</div>;
  } else if (session) {
    return (
      <div className="my-3">
        Logged in as <span>{session.userInfo?.name}</span>{" "}
        <button
          className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
          onClick={() => {
            keycloakSessionLogOut()
            .then((ok: boolean) => {
              if (ok) {
                signOut({ callbackUrl: "/" })
              } else {
                //TODO: adicionar snack com erro de login
                console.log('ocorreu um problema, tente novamente')
              }
            })
            .catch((error) => {
              console.error(error);
            });;
          }}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="my-3">
      Not logged in.{" "}
      <button
        className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
        onClick={() => signIn("keycloak")}>
        Log in
      </button>
    </div>
  )
}

export default AuthStatus;