import { getProcessoContratacaoPorCotacao } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cotacaoUuid: string }> }
) {
  const resolvedParams = await params;
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getProcessoContratacaoPorCotacao(
    resolvedParams.cotacaoUuid,
    accessToken
  );
  if (!data) {
    return NextResponse.json(
      { message: "Nenhum processo de contratação encontrado para esta cotação." },
      { status: 404 }
    );
  }
  return NextResponse.json(data);
}
