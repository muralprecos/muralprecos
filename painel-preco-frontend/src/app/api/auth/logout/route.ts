import { NextResponse } from "next/server";
import { getRefreshToken, getIdToken } from "@/lib/auth";
import { deleteSession } from "@/lib/session";
import { postLogout } from "@/hooks/api";

export async function POST() {
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
  return NextResponse.json({ ok: true });
}
