import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import { CheckRolesStrategy } from "@/utils/rolesUtils";
import { getCotacaoFilterOptions } from "../_lib/getCotacaoFilterOptions";
import ListagemCotacaoClient from "./_components/ListagemCotacaoClient";

export default async function ListItemLicitacao() {
  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL,
  );

  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? "/unauthorized");
  }

  const options = await getCotacaoFilterOptions({ accessToken });

  return <ListagemCotacaoClient session={session} options={options} />;
}
