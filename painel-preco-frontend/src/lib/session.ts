import "server-only";
import { cookies } from "next/headers";
import { SessionPayload } from "@/interfaces/auth";
import {
  COOKIE_NAME,
  encryptSession,
  decryptSession,
} from "./session-utils";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return decryptSession(cookie.value);
}

export async function setSession(payload: SessionPayload): Promise<void> {
  const encrypted = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
