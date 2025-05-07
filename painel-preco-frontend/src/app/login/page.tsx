import Login from "@/components/organisms/Login";
import { INITIAL_PAGE_LOGGED } from "@/utils/routesUtils";
import { auth } from "auth";
import { Session } from "next-auth";
import { redirect } from 'next/navigation';
import React from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default async function LoginPage(props: Props) {

  const session : Session | null = await auth();
  if (session && session.userInfo) {
    redirect(INITIAL_PAGE_LOGGED);
  }

  return (
    <Login
      session={session}
      error={props.searchParams?.error}
      callbackUrl={props.searchParams?.callbackUrl}
    />
  );
}