import Login from "@/components/organisms/Login";
import { INITIAL_PAGE_LOGGED } from "@/utils/routesUtils";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type SearchParams = Record<"callbackUrl" | "error", string>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session: Session | null = await auth();
  if (session && session.userInfo) {
    redirect(INITIAL_PAGE_LOGGED);
  }

  const resolvedParams = await searchParams;

  return (
    <Login
      session={session}
      error={resolvedParams?.error}
      callbackUrl={resolvedParams?.callbackUrl}
    />
  );
}
