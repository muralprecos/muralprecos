"use server";

import { jwtDecode } from "jwt-decode";
import { postRefreshToken } from "@/hooks/api";
import { SessionPayload } from "@/interfaces/auth";
import { IUserInfo } from "@/interfaces/types";
import { getSession, setSession } from "@/lib/session";

async function refreshAccessToken(): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session?.refresh_token) return { error: "NoRefreshToken" };

  try {
    const resp = await postRefreshToken(session.refresh_token);
    const refreshedData = await resp.json();
    if (!resp.ok) throw refreshedData;

    const newSession: SessionPayload = {
      ...session,
      access_token: refreshedData.access_token,
      decoded: jwtDecode<IUserInfo>(refreshedData.access_token),
      id_token: refreshedData.id_token ?? session.id_token,
      refresh_token: refreshedData.refresh_token,
      error: undefined,
    };
    await setSession(newSession);
    return {};
  } catch {
    return { error: "RefreshAccessTokenError" };
  }
}

export async function loginRefreshToken() {
  return await refreshAccessToken();
}
