import {
  IAPISearchInfo,
  IAPISearchProps,
  IReturnRequestAPI,
} from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextResponse } from "next/server";

export async function genericGET(
  getAPI: (opts: IAPISearchProps) => Promise<IReturnRequestAPI<any> | null>,
  info: IAPISearchInfo[]
) {
  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getAPI({ info, accessToken });

  if (!data) {
    return NextResponse.json(
      { message: "No data returned from API" },
      { status: 204 }
    );
  }

  return NextResponse.json(data);
}
