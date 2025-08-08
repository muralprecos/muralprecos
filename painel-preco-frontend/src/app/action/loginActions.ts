"use server";

import { messages } from "@/utils/messages";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  formData: Partial<Record<"username" | "password" | "redirect", unknown>>
) {
  try {
    const res = await signIn('credentials', {
      username: formData.username,
      password: formData.password,
      redirect: false, // <- NÃO redireciona automaticamente
    });

    // Se houve erro (ex: senha incorreta)
    if (res?.error) {
      return { error: res.error };
    }

    // Login bem-sucedido
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: messages.LOGIN_WRONG };
        default:
          return {
            error: 'CredentialsSignin',
            message: messages.LOGIN_WRONG,
          };
      }
    }

    // Fallback para erro desconhecido
    return {
      error: "UNKNOWN_ERROR",
      message: "Erro desconhecido.",
    };
  }
}
