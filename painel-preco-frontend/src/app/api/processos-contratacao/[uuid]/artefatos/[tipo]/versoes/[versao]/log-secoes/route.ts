import { getLogSecoesArtefato } from "@/hooks/api";
import { TipoArtefatoEnum } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; tipo: string; versao: string }> }
) {
  const resolvedParams = await params;
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getLogSecoesArtefato(
    resolvedParams.uuid,
    resolvedParams.tipo.toUpperCase() as TipoArtefatoEnum,
    Number(resolvedParams.versao),
    accessToken
  );
  return NextResponse.json(data);
}
