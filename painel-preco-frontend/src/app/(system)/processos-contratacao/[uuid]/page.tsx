import { redirect } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/rolesUtils";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import ViewProcessoContratacao from "./ViewProcessoContratacao";

export const metadata = { title: "Processo de Contratação | Painel de Preços" };

export default async function ProcessoContratacaoPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL
  );
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? "/unauthorized");
  }

  const resolvedParams = await params;
  return <ViewProcessoContratacao uuid={resolvedParams.uuid} />;
}
