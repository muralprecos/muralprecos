"use server";

import { messages } from "@/utils/messages";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import logger from "../../../services/logger";

export async function loginAction(formData: Partial<Record<"username" | "password" | "redirect", unknown>>) {
  try {
    logger.info("...loginAction...");
    return signIn('credentials', {
      username: formData.username,
      password: formData.password,
      redirectTo: '/'
    });
  } catch (error) {
    logger.info("loginAction error");
    if (error instanceof AuthError) {
      logger.info("loginAction AuthError");
      logger.error(error.type, error.message)
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