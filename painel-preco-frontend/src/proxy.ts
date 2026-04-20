import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, decryptSession } from "@/lib/session-utils";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/unauthorized", whenAuthenticated: "redirect" },
  { path: "/validar-cotacao", whenAuthenticated: "next" },
] as const;

const ROOT_ROUTE = "/";
const LOGIN_ROUTE = "/login";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const sessionCookie = req.cookies.get(COOKIE_NAME);
  let isLoggedIn = false;

  if (sessionCookie?.value) {
    const session = await decryptSession(sessionCookie.value);
    isLoggedIn = !!session && !session.error;
  }

  const publicRouteConfig = publicRoutes.find((route) => route.path === path);
  const isPublicRoute = !!publicRouteConfig;

  if (isLoggedIn && publicRouteConfig?.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(ROOT_ROUTE, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|validar-cotacao).*)",
  ],
};
