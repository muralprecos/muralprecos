"use server";

import { JWT } from "next-auth/jwt";

async function checkAccessToken(token: JWT): Promise<boolean> {
  try {
    const resp = await fetch(`${process.env.CHECK_SESSION_URL}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      method: "GET",
    });
    const result = await resp.json();
    return resp.status == 200;
  } catch (error) {
    return false;
  }
}

export async function authCheckSession(token: JWT) {
  return await checkAccessToken(token);
}
