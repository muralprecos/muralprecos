"use server";

import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { signOut } from "auth";
import { AuthError } from "next-auth";

export async function logoutAction() {
  try {
    await signOut({
      redirectTo: INITIAL_PAGE_LOGIN
    })
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