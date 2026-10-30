import { getItemLicitacao } from "@/hooks/api";
import { IAPISearchInfo } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params;

  const info: IAPISearchInfo[] = [];
  if (uuid) {
    info.push({ param: "uuid", val: uuid });
  }

  const accessToken = (await getAccessToken()) || "";
  if (!accessToken) {
    return NextResponse.json(
      { message: "Wrong Access, please login!" },
      { status: 401 }
    );
  }

  const data = await getItemLicitacao({ info, accessToken });
  return NextResponse.json(data);
}
