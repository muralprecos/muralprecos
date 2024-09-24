import { genericGET } from "@/app/api/autocomplete/genericroute";
import { getListMunicipios } from "@/hooks/api";
import { IAPISearchInfo } from "@/interfaces/types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { uuiduf: string; nome: string } }
) {
  //parametros enviados
  const info: IAPISearchInfo[] = [];
  if (!!params.uuiduf) {
    info.push({ param: 'uuiduf', val: params.uuiduf })
  }
  if (!!params.nome && params.nome.length > 0) {
    info.push({ param: 'nome', val: params.nome[0] })
  }

  return genericGET(getListMunicipios, info);
}