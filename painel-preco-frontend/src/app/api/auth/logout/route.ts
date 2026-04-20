import { NextResponse } from "next/server";
import { getRefreshToken } from "@/lib/auth";
import { deleteSession } from "@/lib/session";
import { postLogout } from "@/hooks/api";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await postLogout(refreshToken);
    }
  } catch {
    // Continue with local logout even if backend call fails
  }

  await deleteSession();
  return NextResponse.json({ ok: true });
}
