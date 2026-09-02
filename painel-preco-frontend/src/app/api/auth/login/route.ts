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
  } catch (error) {
    console.error("[auth/login] Erro ao processar JSON da requisição:", error);
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    console.warn("[auth/login] Tentativa de login com campos obrigatórios ausentes:", {
      hasUsername: !!username,
      hasPassword: !!password,
    });
    return NextResponse.json(
      { error: "Credenciais obrigatórias" },
      { status: 400 }
    );
  }

  try {
    const res = await postLogin({ username, password });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[auth/login] Backend retornou erro na autenticação:", {
        targetUrl: `${process.env.API_URL}${process.env.API_URL_PREFIX}/auth/logon`,
        status: res.status,
        statusText: res.statusText,
        username,
        responseBody: text,
      });

      let errorMsg = "Credenciais inválidas";
      try {
        const parsed = JSON.parse(text);
        errorMsg = parsed?.message || parsed?.error || errorMsg;
      } catch {
        if (text && !text.trim().startsWith("<")) {
          errorMsg = text;
        } else if (text && text.trim().startsWith("<")) {
          errorMsg = "Erro na comunicação com o servidor de autenticação";
        }
      }
      const status = res.status === 401 ? 401 : res.status >= 400 && res.status < 500 ? res.status : 500;
      return NextResponse.json({ error: errorMsg }, { status });
    }

    const data = await res.json();
    const decoded = jwtDecode<IUserInfo>(data.access_token);

    const session: SessionPayload = {
      access_token: data.access_token,
      id_token: data.id_token ?? "",
      refresh_token: data.refresh_token,
      decoded,
      session_start: Date.now(),
    };

    await setSession(session);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[auth/login] Exceção inesperada durante o login:", error);
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    );
  }
}

