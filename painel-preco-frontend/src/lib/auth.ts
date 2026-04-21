import "server-only";
import { jwtDecode } from "jwt-decode";
import { getSession, setSession, deleteSession } from "./session";
import { isTokenExpired } from "./session-utils";
import { ClientSession, SessionPayload } from "@/interfaces/auth";
import { IUserInfo } from "@/interfaces/types";
import { postRefreshToken } from "@/hooks/api";

async function refreshSession(
  session: SessionPayload
): Promise<SessionPayload | null> {
  try {
    const resp = await postRefreshToken(session.refresh_token);
    if (!resp.ok) return null;
    const data = await resp.json();
    const newSession: SessionPayload = {
      ...session,
      access_token: data.access_token,
      id_token: data.id_token,
      refresh_token: data.refresh_token,
      decoded: jwtDecode<IUserInfo>(data.access_token),
      error: undefined,
    };
    await setSession(newSession);
    return newSession;
  } catch {
    return null;
  }
}

/**
 * Returns the sanitized client-facing session (no raw tokens).
 * Automatically refreshes the access token if expired.
 */
export async function auth(): Promise<ClientSession | null> {
  let session = await getSession();
  if (!session) return null;

  if (isTokenExpired(session.access_token)) {
    const refreshed = await refreshSession(session);
    if (!refreshed) {
      // deleteSession() cannot write cookies during Server Component rendering.
      // The middleware handles cookie cleanup before the render reaches here.
      try { await deleteSession(); } catch { /* ignore: running inside a render */ }
      return null;
    }
    session = refreshed;
  }

  return {
    userInfo: session.decoded,
    roles: session.decoded?.realm_access?.roles ?? [],
    error: session.error,
  };
}

/**
 * Returns the raw access token for server-side use (API routes, Server Components).
 * Automatically refreshes if expired.
 */
export async function getAccessToken(): Promise<string | null> {
  let session = await getSession();
  if (!session || session.error) return null;

  if (isTokenExpired(session.access_token)) {
    const refreshed = await refreshSession(session);
    if (!refreshed) {
      try { await deleteSession(); } catch { /* ignore: running inside a render */ }
      return null;
    }
    session = refreshed;
  }

  return session.access_token;
}

export async function getRefreshToken(): Promise<string | null> {
  const session = await getSession();
  if (!session || session.error) return null;
  return session.refresh_token;
}

export async function getIdToken(): Promise<string | null> {
  const session = await getSession();
  if (!session || session.error) return null;
  return session.id_token;
}
