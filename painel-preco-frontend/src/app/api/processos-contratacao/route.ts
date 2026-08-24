import { postCreateProcessoContratacao } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.json();
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  try {
    const data = await postCreateProcessoContratacao(form, accessToken);
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      {
        message:
          e?.statusDetails ||
          e?.message ||
          "Erro ao criar o processo de contratação.",
      },
      { status: e?.statusCode || 500 }
    );
  }
}
