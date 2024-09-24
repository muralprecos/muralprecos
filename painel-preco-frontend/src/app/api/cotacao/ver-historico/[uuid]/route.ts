import { getHistoricoCotacao } from "@/hooks/api";
import { IAPISearchInfo } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string; } }
) {
  //parametros enviados
  const info: IAPISearchInfo[] = [];
  if (!!params.uuid) {
    info.push({ param: 'uuid', val: params.uuid })
  }

  //validar acesso
  const accessToken = await getAccessToken() || '';
  if (!accessToken) {
    return NextResponse.json({ message: "Wrong Access, please login!" });
  }

  //consultar API
  const data = await getHistoricoCotacao({info, accessToken});
  return NextResponse.json(data);
}