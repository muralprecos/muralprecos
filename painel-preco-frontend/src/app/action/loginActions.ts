"use server";

import { messages } from "@/utils/messages";
import { signIn } from "auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: Partial<Record<"username" | "password" | "redirect", unknown>>) {
  try {
    await signIn('credentials', {
      username: formData.username,
      password: formData.password,
      redirectTo: '/'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      console.error(error.type, error.message)
      switch (error.type) {
        case 'CredentialsSignin':
          return {error: messages.LOGIN_WRONG}
        default:
          return {error: 'Ocorreu um problema ao autenticar'}
      }
    }
    throw error;
  }
}