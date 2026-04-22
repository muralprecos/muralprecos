"use server";

import { redirect } from "next/navigation";
import { getRefreshToken, getIdToken } from "@/lib/auth";
import { deleteSession } from "@/lib/session";
import { postLogout } from "@/hooks/api";

export async function logoutAction() {
  try {
    const [refreshToken, idToken] = await Promise.all([
      getRefreshToken(),
      getIdToken(),
    ]);
    if (refreshToken) {
      await postLogout(refreshToken, idToken ?? undefined);
    }
  } catch {
    // Continue with local logout even if backend call fails
  }

  await deleteSession();
  redirect("/login");
}