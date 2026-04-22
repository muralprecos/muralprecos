import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";

const backendUrl = (id: string) =>
  `${process.env.API_URL}${process.env.API_URL_PREFIX}/organizacoes/${id}/detalhes`;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
