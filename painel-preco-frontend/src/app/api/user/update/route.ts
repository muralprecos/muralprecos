import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { IUserInfo } from "@/interfaces/types";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import {
  postAuthGrantClientCredentialsKeycloak,
  putChangeUserDataKeycloak,
  putChangeUserPasswordKeycloak,
} from "@/hooks/api";

export async function POST(req: NextRequest) {
  const token = (await getAccessToken()) || "";
  if (!token)
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );

  const decoded: any = jwtDecode<IUserInfo>(token);
  const userId = decoded?.sub;
  if (!userId)
    return NextResponse.json(
      { error: "Usuário não encontrado, logue novamente e repita a operação." },
      { status: 400 }
    );

  const { firstName, lastName, email, newPassword } = await req.json();

  const tokenRes = await postAuthGrantClientCredentialsKeycloak();
  const { access_token: adminToken } = await tokenRes.json();

  const userData = {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(email && { email }),
  };

  const res = await putChangeUserDataKeycloak(userId, adminToken, userData);
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Erro ao atualizar dados do usuário.", details: err },
      { status: 500 }
    );
  }

  if (newPassword) {
    const pwdRes = await putChangeUserPasswordKeycloak(
      userId,
      adminToken,
      newPassword
    );
    if (!pwdRes.ok) {
      const err = await pwdRes.text();
      return NextResponse.json(
        { error: "Erro ao alterar senha.", details: err },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
