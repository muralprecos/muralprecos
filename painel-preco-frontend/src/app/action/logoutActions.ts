"use server";

import { redirect } from "next/navigation";
import { getRefreshToken } from "@/lib/auth";
import { deleteSession } from "@/lib/session";
import { postLogout } from "@/hooks/api";

export async function logoutAction() {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await postLogout(refreshToken);
    }
  } catch {
    // Continue with local logout even if backend call fails
  }

  await deleteSession();
  redirect("/login");
}