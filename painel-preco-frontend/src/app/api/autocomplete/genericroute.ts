import { IAPISearchInfo, IAPISearchProps, IReturnRequestAPI } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextResponse } from "next/server";


export async function genericGET(
  getAPI: (opts: IAPISearchProps) => Promise<IReturnRequestAPI<any> | null>,
  info: IAPISearchInfo[]
) {
  //validar acesso
  const accessToken = await getAccessToken() || '';
  if (!accessToken) {
    return NextResponse.json({ message: "Wrong Access, please login!" });
  }

  //consultar API
  const data = await getAPI({info, accessToken});
  return NextResponse.json(data);
}