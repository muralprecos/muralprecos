import { genericGET } from "@/app/api/autocomplete/genericroute";
import { getListDescricao, getListFornecedores, getListNomeMaterial, getListObjetosCompras, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento } from "@/hooks/api";
import { IAPISearchInfo, IAPISearchProps, IReturnRequestAPI } from "@/interfaces/types";
import { NextRequest, NextResponse } from "next/server";

type FuncAPI = (opts: IAPISearchProps) => Promise<IReturnRequestAPI<any> | null>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ obj: string; param: string; nome?: string[] }> }
) {
  const resolvedParams = await params;

  const info: IAPISearchInfo[] = [];

  if (resolvedParams.nome && resolvedParams.nome.length > 0) {
    info.push({ param: resolvedParams.param, val: resolvedParams.nome[0] });
  }

  const o = resolvedParams.obj;

  const apiMap: Record<string, FuncAPI> = {
    'descricao': getListDescricao,
    'descricao-complementar': getListDescricao,
    'fornecedores': getListFornecedores,
    'nome-material': getListNomeMaterial,
    'objeto-compra': getListObjetosCompras,
    'orgaos': getListOrgaos,
    'orgaos-superiores': getListOrgaosSuperiores,
    'unidade-fornecimento': getListUnidadesFornecimento,
    'unidade-gestora': getListUASG,
  };

  const getAPI = apiMap[o] ?? null;

  if (getAPI == null) {
    return NextResponse.json(
      { message: "Wrong Access!" },
      { status: 400 }
    );
  }

  return genericGET(getAPI, info);
}
