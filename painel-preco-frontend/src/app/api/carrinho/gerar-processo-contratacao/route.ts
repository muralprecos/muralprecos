import { postMaterializarCotacaoDoCarrinho } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  try {
    const cotacaoUuid = await postMaterializarCotacaoDoCarrinho(
      req.cart,
      accessToken
    );
    if (!cotacaoUuid) {
      return NextResponse.json(
        { message: "Não foi possível gerar a cotação a partir do carrinho." },
        { status: 500 }
      );
    }
    return NextResponse.json({ cotacaoUuid });
  } catch (e: any) {
    return NextResponse.json(
      {
        message:
          e?.statusDetails ||
          e?.message ||
          "Erro ao gerar a cotação a partir do carrinho.",
      },
      { status: e?.statusCode || 500 }
    );
  }
}
