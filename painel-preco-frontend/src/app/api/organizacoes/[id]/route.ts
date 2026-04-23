import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { ROLES } from "@/lib/authorization/roles";
import { requireRoleSession } from "@/lib/authorization/server";

const backendUrl = (id: string) =>
  `${process.env.API_URL}${process.env.API_URL_PREFIX}/organizacoes/${id}`;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const { id } = await params;
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(backendUrl(id), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const { id } = await params;
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();

  const res = await fetch(backendUrl(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const { id } = await params;
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(backendUrl(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

