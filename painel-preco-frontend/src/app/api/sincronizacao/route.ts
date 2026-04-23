import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { ROLES } from "@/lib/authorization/roles";
import { requireRoleSession } from "@/lib/authorization/server";

const backendBase = () => `${process.env.API_URL}${process.env.API_URL_PREFIX}`;

export async function POST() {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(`${backendBase()}/sincronizacao`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
