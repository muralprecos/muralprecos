import "server-only";
import { cookies } from "next/headers";
import { SessionPayload } from "@/interfaces/auth";
import { COOKIE_NAME } from "./session-utils";
import {
  sessionStoreGet,
  sessionStoreSet,
  sessionStoreDelete,
} from "./session-store";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  return sessionStoreGet(sessionId);
}

export async function setSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // Only write the cookie when creating a new session (UUID is tiny, always < 4096 bytes).
    cookieStore.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  // For existing sessions (e.g. token refresh) we only update the store — no cookie write.
  // This avoids the "cannot set cookie during Server Component rendering" limitation.
  sessionStoreSet(sessionId, payload);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId) {
    sessionStoreDelete(sessionId);
  }
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
