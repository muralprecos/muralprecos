"use server";

import { messages } from "@/utils/messages";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  formData: Partial<Record<"username" | "password" | "redirect", unknown>>
) {
  try {
    const res = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    // Se houve erro (ex: senha incorreta)
    if (res?.error) {
      //console.error("❌ [LOGIN_ACTION] Erro:", res.error);
      return { error: res.error };
    }

    return { success: true };
  } catch (error) {
    //console.error("❌ [LOGIN_ACTION] Exceção:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: messages.LOGIN_WRONG };
        default:
          return {
            error: "CredentialsSignin",
            message: messages.LOGIN_WRONG,
          };
      }
    }

    return {
      error: "UNKNOWN_ERROR",
      message: "Erro desconhecido.",
    };
  }
}
