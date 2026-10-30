import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSession, setSession } from "@/lib/session";

// Garante que a rota nunca seja cacheada e que Set-Cookie seja sempre enviado
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session
 * Returns sanitized session data for client consumption (no raw tokens).
 * Automatically refreshes the access token if expired.
 */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }
  return NextResponse.json(session);
}

/**
 * PATCH /api/auth/session
 * Updates userInfo fields in the session cookie (e.g. after profile edit).
 * Only firstName, lastName, email, name are accepted — tokens are never modified here.
 */
export async function PATCH(req: NextRequest) {
  const currentSession = await getSession();
  if (!currentSession) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const updatedDecoded = {
    ...currentSession.decoded,
    ...(body.firstName !== undefined && { given_name: body.firstName }),
    ...(body.lastName !== undefined && { family_name: body.lastName }),
    ...(body.email !== undefined && { email: body.email }),
    ...(body.name !== undefined && { name: body.name }),
  };

  await setSession({ ...currentSession, decoded: updatedDecoded });
  return NextResponse.json({ ok: true });
}
