import { getDashboardResumo } from "@/hooks/api";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = await getAccessToken() || '';

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
  }

  try {
    const data = await getDashboardResumo({ accessToken });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json({ message: "Erro ao carregar dados do dashboard" }, { status: 500 });
  }
}
