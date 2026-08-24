import { postGerarArtefato } from "@/hooks/api";
import { TipoArtefatoEnum } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; tipo: string }> }
) {
  const resolvedParams = await params;
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  try {
    const data = await postGerarArtefato(
      resolvedParams.uuid,
      resolvedParams.tipo.toUpperCase() as TipoArtefatoEnum,
      accessToken
    );
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      {
        message:
          e?.statusDetails || e?.message || "Erro ao gerar o artefato.",
      },
      { status: e?.statusCode || 500 }
    );
  }
}
