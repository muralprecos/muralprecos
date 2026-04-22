import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const { cnpj } = await params;
  const digits = cnpj.replace(/\D/g, "");

  if (digits.length !== 14) {
    return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
  }

  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
    next: { revalidate: 86400 }, // cache por 24h
  });

  if (!res.ok) {
    const status = res.status === 404 ? 404 : 502;
    return NextResponse.json(
      { error: "CNPJ não encontrado" },
      { status }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    razaoSocial: data.razao_social ?? "",
    nomeFantasia: data.nome_fantasia ?? "",
    telefone: data.ddd_telefone_1
      ? `${data.ddd_telefone_1}`.replace(/\D/g, "")
      : "",
  });
}
