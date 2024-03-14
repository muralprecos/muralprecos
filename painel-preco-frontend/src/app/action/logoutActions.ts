"use server";

import { signOut } from "auth";
import { AuthError } from "next-auth";

export async function logoutAction() {
  try {
    await signOut({
      redirectTo: '/'
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