import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/session-utils";
import { LOGIN_PATH } from "./context/AuthContext";

// Public routes are always passed through without cookie checks.
// The login page is a Server Component that calls auth() and redirects to /
// when a valid session exists — that is the authoritative authenticated-redirect gate.
const publicPaths = ["/login", "/unauthorized", "/validar-cotacao"];

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Always let public routes through — session validity is checked by the page itself
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  const sessionId = req.cookies.get(COOKIE_NAME)?.value;

  // No cookie on a protected route — redirect to login
  if (!sessionId) {
    return NextResponse.redirect(new URL(LOGIN_PATH, nextUrl));
  }

  // Cookie present — session validity is verified in the Node.js layer by auth().
  // Stale/invalid session IDs: auth() returns null → AuthContext logs out + redirects.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api(?!/auth/session)|_next/static|_next/image|favicon.ico|validar-cotacao).*)",
  ],
};

