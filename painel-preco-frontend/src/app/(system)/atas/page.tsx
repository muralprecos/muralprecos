import { redirect } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/rolesUtils";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import AtasDashboardClient from "./_components/PageClient";

export const metadata = { title: "Atas de Registro de Preço | Painel de Preços" };

export default async function AtasPage() {
  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL
  );
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? "/unauthorized");
  }

  return <AtasDashboardClient />;
}
