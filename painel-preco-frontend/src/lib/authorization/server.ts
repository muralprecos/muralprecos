import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Role, hasRole } from "./roles";

export async function requireRoleSession(role: Role) {
  const session = await auth();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }),
    };
  }

  if (!hasRole(session.roles, role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Sem permissão" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
