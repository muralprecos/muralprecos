import { genericGET } from "@/app/api/autocomplete/genericroute";
import { getListDescricao, getListFornecedores, getListNomeMaterial, getListObjetosCompras, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento } from "@/hooks/api";
import { IAPISearchInfo, IAPISearchProps, IReturnRequestAPI } from "@/interfaces/types";
import { NextRequest, NextResponse } from "next/server";

type FuncAPI = (opts:IAPISearchProps)=>Promise<IReturnRequestAPI<any>|null>

export async function GET(
  request: NextRequest,
  { params }: { params: { obj: string, param: string, nome: string } }
) {
  //parametros enviados
  const info: IAPISearchInfo[] = [];
  if (!!params.nome && params.nome.length > 0) {
    info.push({ param: params.param, val: params.nome[0] })
  }

  const o = params.obj;
  const getAPI : FuncAPI|null = o == 'descricao' ? getListDescricao :
                    o == 'descricao-complementar' ? getListDescricao :
                    o == 'fornecedores' ? getListFornecedores :
                    o == 'nome-material' ? getListNomeMaterial :
                    o == 'objeto-compra' ? getListObjetosCompras :
                    o == 'orgaos' ? getListOrgaos :
                    o == 'orgaos-superiores' ? getListOrgaosSuperiores :
                    o == 'unidade-fornecimento' ? getListUnidadesFornecimento :
                    o == 'unidade-gestora' ? getListUASG :
                    null;
  
  //TODO: apriomorar retorno de erro
  if (getAPI == null) return NextResponse.json({ message: "Wrong Access!" });;
  return genericGET(getAPI, info);
}