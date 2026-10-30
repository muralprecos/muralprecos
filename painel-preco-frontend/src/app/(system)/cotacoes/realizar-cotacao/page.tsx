import { redirect } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/rolesUtils";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import SearchItensLicitacao from "./_components/SearchItensLicitacao";
import { getCotacaoFilterOptions } from "../_lib/getCotacaoFilterOptions";

export default async function CotacaoHome() {
  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL
  );
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? "/unauthorized");
  }

  const options = await getCotacaoFilterOptions({ accessToken });
  return (
    <>
      <SearchItensLicitacao
        session={session}
        empresaPorte={options.empresaPorte}
        esferas={options.esferas}
        compraFormas={options.compraFormas}
        compraModalidades={options.compraModalidades}
        compraPeriodos={options.compraPeriodos}
        situacoesLicitacoes={options.situacoesLicitacoes}
        unidadesFederativas={options.unidadesFederativas}
        anosCompras={options.anosCompras}
      />
    </>
  );
}
