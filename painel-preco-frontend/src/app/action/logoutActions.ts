"use server";

import { postLogout } from "@/hooks/api";
import { getRefreshToken } from "@/utils/sessionTokenAccessor";
import { signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function logoutAction() {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await postLogout(refreshToken);
    }
    await signOut({
      redirectTo: '/'
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        default:
          return {error: 'Ocorreu um problema ao deslogar!'}
      }
    }
    throw error;
  }
}