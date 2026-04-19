"use server";

import { JWT } from "next-auth/jwt";

async function checkAccessToken(token: JWT): Promise<boolean> {
  try {
    const resp = await fetch(
      `${process.env.API_URL}${process.env.API_URL_PREFIX}/usuarios/me`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
        method: "GET",
      }
    );
    // 401 = token rejeitado pelo backend/Keycloak → sessão inválida
    // Qualquer outro status (200, 404, etc.) = token válido
    return resp.status !== 401;
  } catch (error) {
    return false;
  }
}

export async function authCheckSession(token: JWT) {
  return await checkAccessToken(token);
}
