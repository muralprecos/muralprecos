import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { ROLES } from "@/lib/authorization/roles";
import { requireRoleSession } from "@/lib/authorization/server";

const backendUrl = () =>
  `${process.env.API_URL}${process.env.API_URL_PREFIX}/organizacoes`;

export async function GET() {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(`${backendUrl()}?size=100&sort=nome,asc`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();

  const res = await fetch(backendUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
