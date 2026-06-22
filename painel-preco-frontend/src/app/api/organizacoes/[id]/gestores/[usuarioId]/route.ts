import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { ROLES } from "@/lib/authorization/roles";
import { requireRoleSession } from "@/lib/authorization/server";

const backendUrl = (id: string, usuarioId: string) =>
  `${process.env.API_URL}${process.env.API_URL_PREFIX}/organizacoes/${id}/gestores/${usuarioId}`;

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; usuarioId: string }> }
) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const { id, usuarioId } = await params;
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(backendUrl(id, usuarioId), {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200 || res.status === 204) return new NextResponse(null, { status: res.status });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; usuarioId: string }> }
) {
  const authCheck = await requireRoleSession(ROLES.ADMIN);
  if (authCheck.response) return authCheck.response;

  const { id, usuarioId } = await params;
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const res = await fetch(backendUrl(id, usuarioId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204 || res.status === 200) return new NextResponse(null, { status: res.status });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
