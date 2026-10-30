import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";

export async function POST(req: NextRequest) {
  const token = await getAccessToken();
  if (!token)
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );

  const { firstName, lastName, email, newPassword } = await req.json();

  const API_URL = `${process.env.API_URL}${process.env.API_URL_PREFIX}/usuarios/me`;

  const body: Record<string, string> = {};
  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;
  if (email) body.email = email;
  if (newPassword) body.password = newPassword;

  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Erro ao atualizar perfil.", details: err },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
