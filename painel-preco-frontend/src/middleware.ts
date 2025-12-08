import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config"; // <-- Importa a config segura
import { NextResponse } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/unauthorized", whenAuthenticated: "redirect" },
  { path: "/validar-cotacao", whenAuthenticated: "next" },
] as const;

const ROOT_ROUTE = "/";
const LOGIN_ROUTE = "/login";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isLoggedIn = !!req.auth;

  const publicRouteConfig = publicRoutes.find(route => route.path === path);
  const isPublicRoute = !!publicRouteConfig;

  if (isLoggedIn && publicRouteConfig?.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(ROOT_ROUTE, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // O matcher está perfeito, sem necessidade de alteração.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|validar-cotacao).*)"],
};