import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { ROLES } from "@/lib/authorization/roles";
import { requireAnyRoleSession } from "@/lib/authorization/server";

const backendBase = () => `${process.env.API_URL}${process.env.API_URL_PREFIX}`;

export async function GET(req: NextRequest) {
  const authCheck = await requireAnyRoleSession([ROLES.ADMIN, ROLES.GESTOR]);
  if (authCheck.response) return authCheck.response;

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(`${backendBase()}/usuarios/minha-organizacao?size=100&sort=login,asc`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
