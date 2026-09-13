import { getDownloadArtefatoFinal } from "@/hooks/api";
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

  try {
    const res = await getDownloadArtefatoFinal(
      resolvedParams.uuid,
      resolvedParams.tipo.toUpperCase() as TipoArtefatoEnum,
      Number(resolvedParams.versao),
      accessToken
    );

    if (!res) {
      return NextResponse.json(
        { message: "Não foi possível baixar a versão final do artefato." },
        { status: 500 }
      );
    }

    return new NextResponse(res.blob, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${res.filename || "artefato-final.docx"}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message:
          e?.statusDetails || e?.message || "Erro ao baixar a versão final do artefato.",
      },
      { status: e?.statusCode || 500 }
    );
  }
}
