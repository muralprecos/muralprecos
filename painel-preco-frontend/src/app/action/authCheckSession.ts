"use server";

import { getAccessToken } from "@/utils/sessionTokenAccessor";

async function checkAccessToken(): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) return false;

    const resp = await fetch(
      `${process.env.API_URL}${process.env.API_URL_PREFIX}/usuarios/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    // 401 = token rejeitado pelo backend/Keycloak → sessão inválida
    // 422 é tratado como fallback durante a migração para 401 no backend.
    // Qualquer outro status (200, 404, etc.) = token válido.
    return resp.status !== 401 && resp.status !== 422;
  } catch {
    return false;
  }
}

export async function authCheckSession() {
  return await checkAccessToken();
}
