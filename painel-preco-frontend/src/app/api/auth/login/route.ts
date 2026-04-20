import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { setSession } from "@/lib/session";
import { SessionPayload } from "@/interfaces/auth";
import { IUserInfo } from "@/interfaces/types";
import { postLogin } from "@/hooks/api";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Credenciais obrigatórias" },
      { status: 400 }
    );
  }

  try {
    const res = await postLogin({ username, password });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const status = res.status === 401 ? 401 : 500;
      return NextResponse.json(
        { error: text || "Credenciais inválidas" },
        { status }
      );
    }

    const data = await res.json();
    const decoded = jwtDecode<IUserInfo>(data.access_token);

    const session: SessionPayload = {
      access_token: data.access_token,
      id_token: data.id_token ?? "",
      refresh_token: data.refresh_token,
      decoded,
    };

    await setSession(session);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    );
  }
}
