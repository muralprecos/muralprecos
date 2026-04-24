import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/session-utils";

// valores do whenAuthenticated:
// "next" = permite acesso à rota mesmo estando autenticado
// "redirect" = redireciona para / se o usuário já estiver logado
const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/unauthorized", whenAuthenticated: "redirect" },
  { path: "/validar-cotacao", whenAuthenticated: "next" },
] as const;

const ROOT_ROUTE = "/";
const LOGIN_ROUTE = "/login";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const publicRouteConfig = publicRoutes.find((route) => route.path === path);
  const isPublicRoute = !!publicRouteConfig;

  const sessionId = req.cookies.get(COOKIE_NAME)?.value;

  // No cookie on a protected route — redirect to login
  if (!sessionId) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }

  // Cookie present — treat as potentially authenticated.
  // Invalid/expired session IDs are handled in the Node.js layer by auth():
  // getSession() returns null → layout/Server Component redirects to /login.

  // Authenticated user hitting a "redirect-when-authenticated" public route
  if (publicRouteConfig?.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(ROOT_ROUTE, nextUrl));
  }

  return NextResponse.next();
}

// API routes are excluded except /api/auth/session which needs session cookie forwarding.
export const config = {
  matcher: [
    "/((?!api(?!/auth/session)|_next/static|_next/image|favicon.ico|validar-cotacao).*)",
  ],
};

