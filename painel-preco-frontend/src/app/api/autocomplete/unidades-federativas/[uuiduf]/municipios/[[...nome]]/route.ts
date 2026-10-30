import { genericGET } from "@/app/api/autocomplete/genericroute";
import { getListMunicipios } from "@/hooks/api";
import { IAPISearchInfo } from "@/interfaces/types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuiduf: string; nome?: string[] }> }
) {
  const resolvedParams = await params;

  const info: IAPISearchInfo[] = [];
  if (!!resolvedParams.uuiduf) {
    info.push({ param: "uuiduf", val: resolvedParams.uuiduf });
  }
  if (!!resolvedParams.nome && resolvedParams.nome.length > 0) {
    info.push({ param: "nome", val: resolvedParams.nome[0] });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  if (page) {
    info.push({ param: "page", val: page });
  }
  if (size) {
    info.push({ param: "size", val: size });
  }

  return genericGET(getListMunicipios, info);
}
