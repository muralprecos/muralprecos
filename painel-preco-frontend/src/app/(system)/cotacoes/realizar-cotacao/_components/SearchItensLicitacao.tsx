"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { addSnackError, addSnackIfSelectEmpty } from "@/utils/snackbarUtils";
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
      addSnackError(enqueueSnackbar, messages.AUTH_ERROR_UNAUTHORIZED);
      logoutAction();
    } else {
      addSnackIfSelectEmpty(enqueueSnackbar, "Anos da Compra", anosCompras);
      addSnackIfSelectEmpty(
        enqueueSnackbar,
        "Portes das Empresas",
        empresaPorte
      );
      addSnackIfSelectEmpty(enqueueSnackbar, "Esferas", esferas);
      addSnackIfSelectEmpty(enqueueSnackbar, "Formas de Compra", compraFormas);
      addSnackIfSelectEmpty(
        enqueueSnackbar,
        "Modalidades de Compra",
        compraModalidades
      );
      addSnackIfSelectEmpty(
        enqueueSnackbar,
        "Períodos de Compra",
        compraPeriodos
      );
      addSnackIfSelectEmpty(
        enqueueSnackbar,
        "Situações das Licitações",
        situacoesLicitacoes
      );
      addSnackIfSelectEmpty(
        enqueueSnackbar,
        "Unidades Federativas",
        unidadesFederativas
      );
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
