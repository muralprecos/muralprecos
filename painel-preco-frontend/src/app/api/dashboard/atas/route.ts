import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";

const BASE = `${process.env.API_URL}${process.env.API_URL_PREFIX ?? "/serverapi/v1"}`;

async function backendGet(path: string, accessToken: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Backend ${path} → ${res.status}`);
  return res.json();
}

function filtroQueryParams(searchParams: URLSearchParams, incluir: string[]): URLSearchParams {
  const qs = new URLSearchParams();
  for (const nome of incluir) {
    const valor = searchParams.get(nome);
    if (valor) qs.set(nome, valor);
  }
  return qs;
}

export async function GET(req: NextRequest) {
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const recurso = searchParams.get("recurso");
  const filtrosBase = ["dataInicio", "dataFim", "situacao", "objeto"];

  try {
    switch (recurso) {
      case "kpis": {
        const qs = filtroQueryParams(searchParams, filtrosBase);
        return NextResponse.json(await backendGet(`/dashboard/atas/kpis?${qs}`, accessToken));
      }

      case "por-situacao": {
        const qs = filtroQueryParams(searchParams, ["dataInicio", "dataFim", "objeto"]);
        return NextResponse.json(await backendGet(`/dashboard/atas/por-situacao?${qs}`, accessToken));
      }

      case "evolucao-mensal": {
        const ano = searchParams.get("ano") ?? String(new Date().getFullYear());
        const qs = filtroQueryParams(searchParams, ["situacao", "objeto"]);
        qs.set("ano", ano);
        return NextResponse.json(await backendGet(`/dashboard/atas/evolucao-mensal?${qs}`, accessToken));
      }

      case "top-objetos": {
        const limite = searchParams.get("limite") ?? "10";
        const qs = filtroQueryParams(searchParams, ["dataInicio", "dataFim", "situacao"]);
        qs.set("limite", limite);
        return NextResponse.json(await backendGet(`/dashboard/atas/top-objetos?${qs}`, accessToken));
      }

      case "alertas-vencimento": {
        const qs = filtroQueryParams(searchParams, ["dataInicio", "dataFim", "objeto"]);
        return NextResponse.json(await backendGet(`/dashboard/atas/alertas-vencimento?${qs}`, accessToken));
      }

      default:
        return NextResponse.json({ error: "Parâmetro 'recurso' inválido" }, { status: 400 });
    }
  } catch (e) {
    console.error("[dashboard/atas]", e);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 502 });
  }
}
