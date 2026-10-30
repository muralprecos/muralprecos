import { getPesquisarCotacoes } from "@/hooks/api";
import {
  IRetornoPesquisaItensLicitacao,
  IReturnRequestAPI,
} from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json({ message: "Wrong Access, please login!" });
  }

  const apiReq: IReturnRequestAPI<IRetornoPesquisaItensLicitacao> | null =
    await getPesquisarCotacoes({ info: req.info, accessToken });
  return NextResponse.json(apiReq);
}
