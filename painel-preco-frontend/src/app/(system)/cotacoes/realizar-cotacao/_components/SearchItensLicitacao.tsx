"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { addSnackIfSelectEmpty } from "@/utils/snackbarUtils";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { logoutAction } from "@/app/action/logoutActions";
import {
  CheckRolesStrategy,
  checkAccessRoles,
} from "@/utils/sessionTokenAccessor";
import { messages } from "@/utils/messages";
import { useAppSelector } from "@/store/store";
import { getUserCartBySession } from "@/utils/cartUtils";
import type { IPropsSearchItensLicitacaoForm } from "./utils";
import SearchItensLicitacaoForm from "./searchItensLicitacaoForm";
import { Card, CardContent } from "@/components/ui/card";
import { notify } from "@/components/molecules/NotifyToast";

const SearchItensLicitacao: React.FC<IPropsSearchItensLicitacaoForm> = ({
  session,
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  ...opts
}) => {
  const [cartsize, setCartsize] = useState<number>(0);
  const _cartList = useAppSelector((state) => state.cartReducer);

  useEffect(() => {
    const ulist = getUserCartBySession(_cartList, session);
    setCartsize(ulist.length);
  }, [_cartList, session]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const hasAuthorization = checkAccessRoles(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL
  );

  useEffect(() => {
    if (!hasAuthorization) {
      notify("error", messages.AUTH_ERROR_UNAUTHORIZED);
      logoutAction();
    } else {
      addSnackIfSelectEmpty("Anos da Compra", anosCompras);
      addSnackIfSelectEmpty("Portes das Empresas", empresaPorte);
      addSnackIfSelectEmpty("Esferas", esferas);
      addSnackIfSelectEmpty("Formas de Compra", compraFormas);
      addSnackIfSelectEmpty("Modalidades de Compra", compraModalidades);
      addSnackIfSelectEmpty("Períodos de Compra", compraPeriodos);
      addSnackIfSelectEmpty("Situações das Licitações", situacoesLicitacoes);
      addSnackIfSelectEmpty("Unidades Federativas", unidadesFederativas);
    }
  }, [
    enqueueSnackbar,
    session,
    hasAuthorization,
    anosCompras,
    compraFormas,
    compraModalidades,
    compraPeriodos,
    empresaPorte,
    esferas,
    situacoesLicitacoes,
    unidadesFederativas,
  ]);

  return (
    <main className="p-6">
      <SearchItensLicitacaoForm
        session={session}
        searchParams={searchParams}
        empresaPorte={empresaPorte}
        esferas={esferas}
        compraFormas={compraFormas}
        compraModalidades={compraModalidades}
        compraPeriodos={compraPeriodos}
        situacoesLicitacoes={situacoesLicitacoes}
        unidadesFederativas={unidadesFederativas}
        anosCompras={anosCompras}
      />
    </main>
  );
};

export default SearchItensLicitacao;
