import { postDownloadItensCotacoes } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();

  //validar acesso
  const accessToken = await getAccessToken() || '';
  if (!accessToken) {
    return NextResponse.json({ message: "Wrong Access, please login!" });
  }

  //consultar API
  const res = await postDownloadItensCotacoes(req.cart, accessToken);

  if (res == null) {
    return NextResponse.json({ message: "Não foi possivel gerar o arquivo da cotação!" });
  } else if (res instanceof Blob) {
    return  new NextResponse(res, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cotacao.pdf"',
      },
    });
  } else {
    return NextResponse.json(res);
  }
}