import { getProcessoContratacao, putAtualizarProcessoContratacao } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const resolvedParams = await params;
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getProcessoContratacao({
    info: [{ param: "uuid", val: resolvedParams.uuid }],
    accessToken,
  });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const resolvedParams = await params;
  const form = await request.json();
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  try {
    const data = await putAtualizarProcessoContratacao(
      resolvedParams.uuid,
      form,
      accessToken
    );
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      {
        message:
          e?.statusDetails ||
          e?.message ||
          "Erro ao atualizar o processo de contratação.",
      },
      { status: e?.statusCode || 500 }
    );
  }
}
