import { redirect } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/rolesUtils";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import FormNovoProcesso from "./FormNovoProcesso";

export const metadata = { title: "Novo Processo de Contratação | Painel de Preços" };

export default async function NovoProcessoContratacaoPage({
  params,
}: {
  params: Promise<{ cotacaoUuid: string }>;
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
  return <FormNovoProcesso cotacaoUuid={resolvedParams.cotacaoUuid} />;
}
