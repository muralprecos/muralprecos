"use server";

import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { postRefreshToken } from "@/hooks/api";

async function refreshAccessToken(token: JWT) {
  try {
    const resp = await postRefreshToken(token.refresh_token ?? "");
    const refreshToken = await resp.json();
    if (!resp.ok) throw refreshToken;

    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      refresh_token: refreshToken.refresh_token,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export async function loginRefreshToken(token: JWT) {
  return await refreshAccessToken(token);
}
