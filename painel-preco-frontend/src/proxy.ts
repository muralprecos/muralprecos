import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { SessionPayload } from "@/interfaces/auth";
import type { IUserInfo } from "@/interfaces/types";
import {
  COOKIE_NAME,
  decryptSession,
  encryptSession,
  isTokenExpired,
} from "@/lib/session-utils";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const publicRouteConfig = publicRoutes.find((route) => route.path === path);
  const isPublicRoute = !!publicRouteConfig;

  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;

  // No cookie on a protected route — redirect to login
  if (!cookieValue) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }

  const session = await decryptSession(cookieValue);

  // JWE invalid / truly expired (jose throws on decrypt) — clear and redirect
  if (!session || session.error) {
    if (isPublicRoute) {
      const res = NextResponse.next();
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
    const res = NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  const isLoggedIn = true; // session decrypted successfully

  // Authenticated user hitting a "redirect-when-authenticated" public route
  if (isLoggedIn && publicRouteConfig?.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(ROOT_ROUTE, nextUrl));
  }

  // Access token still valid — continue
  if (!isTokenExpired(session.access_token)) {
    return NextResponse.next();
  }

  // Access token expired — attempt refresh before the request reaches the app
  try {
    const apiUrl = process.env.API_URL;
    const apiPrefix = process.env.API_URL_PREFIX;
    const body = new URLSearchParams();
    body.append("refresh_token", session.refresh_token);

    const resp = await fetch(`${apiUrl}${apiPrefix}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!resp.ok) throw new Error("Refresh failed");

    const data = await resp.json();
    const newSession: SessionPayload = {
      ...session,
      access_token: data.access_token,
      id_token: data.id_token,
      refresh_token: data.refresh_token,
      decoded: jwtDecode<IUserInfo>(data.access_token),
      error: undefined,
    };

    const encrypted = await encryptSession(newSession);

    // Rewrite cookie on the *request* so Server Components in the same render
    // see the refreshed token and skip a redundant refresh in auth().
    const existingCookies = req.headers.get("cookie") ?? "";
    const cookieRegex = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=[^;]*`);
    const updatedCookies = cookieRegex.test(existingCookies)
      ? existingCookies.replace(cookieRegex, `${COOKIE_NAME}=${encrypted}`)
      : `${COOKIE_NAME}=${encrypted}`;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("cookie", updatedCookies);

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    // Also write to the response so the browser saves the refreshed cookie
    response.cookies.set(COOKIE_NAME, encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    // Refresh token also expired — clear session and send to login
    const res = NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

// Rotas que não passam pelo middleware (ex: APIs, assets estáticos)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|validar-cotacao).*)",
  ],
};
