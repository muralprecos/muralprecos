import { getHistoricoCotacao } from "@/hooks/api";
import { IAPISearchInfo } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const resolvedParams = await params;
  const info: IAPISearchInfo[] = [];
  if (!!resolvedParams.uuid) {
    info.push({ param: "uuid", val: resolvedParams.uuid });
  }

  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getHistoricoCotacao({ info, accessToken });
  return NextResponse.json(data);
}
