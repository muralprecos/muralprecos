"use server";

import { JWT } from "next-auth/jwt";
import logger from "../../../services/logger";
import { jwtDecode } from "jwt-decode";

// this will refresh an expired access token, when needed
async function refreshAccessToken(token: JWT) {
  try{
    const body = new URLSearchParams();
    body.append('client_id', `${process.env.KEYCLOAK_ID}`);
    body.append('client_secret', `${process.env.KEYCLOAK_SECRET}`);
    body.append('grant_type', "refresh_token");
    body.append('refresh_token', token.refresh_token+'');

    const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
      method: "POST",
    });
    const refreshToken = await resp.json();
    if (!resp.ok) throw refreshToken;

    logger.info("Token refreshed!");
    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      refresh_token: refreshToken.refresh_token,
    };
  } catch (error) {
    logger.error("Token refresh error...")
    logger.error(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export async function loginRefreshToken(token: JWT) {
  return await refreshAccessToken(token)
}