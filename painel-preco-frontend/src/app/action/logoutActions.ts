"use server";

import { postLogout } from "@/hooks/api";
import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { getIdToken } from "@/utils/sessionTokenAccessor";
import { signOut } from "auth";
import { AuthError } from "next-auth";

export async function logoutAction() {
  try {
    const accessToken = await getIdToken();
    if (accessToken) {
      await postLogout(accessToken);
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