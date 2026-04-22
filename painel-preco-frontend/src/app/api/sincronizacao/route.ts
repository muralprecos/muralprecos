import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";

const backendBase = () => `${process.env.API_URL}${process.env.API_URL_PREFIX}`;

export async function POST() {
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
