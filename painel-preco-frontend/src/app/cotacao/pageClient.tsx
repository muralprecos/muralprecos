"use client";

import { Card, CardBody } from "@nextui-org/react";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { addSnackIfSelectEmpty } from "@/utils/snackbarUtils";

export const TABS_COTACAO = {
  SEARCH: {
    desc: "Cotação Rápida",
    key: "search"
  },
  LIST: {
    desc: "Resultados",
    key: "result"
  },
  VIEW: {
    desc: "Detalhes",
    key: "view"
  }
}

export const URLPageCotacaoSearch = '/cotacao';
const PageClient: React.FC<IPropsSearchItensLicitacaoForm> = ({
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    addSnackIfSelectEmpty(enqueueSnackbar, "Anos da Compra", anosCompras);
    addSnackIfSelectEmpty(enqueueSnackbar, "Portes das Empresas", empresaPorte);
    addSnackIfSelectEmpty(enqueueSnackbar, "Esferas", esferas);
    addSnackIfSelectEmpty(enqueueSnackbar, "Formas de Compra", compraFormas);
    addSnackIfSelectEmpty(enqueueSnackbar, "Modalidades de Compra", compraModalidades);
    addSnackIfSelectEmpty(enqueueSnackbar, "Períodos de Compra", compraPeriodos);
    addSnackIfSelectEmpty(enqueueSnackbar, "Situações das Licitações", situacoesLicitacoes);
    addSnackIfSelectEmpty(enqueueSnackbar, "Unidades Federativas", unidadesFederativas);
  }, [enqueueSnackbar, anosCompras, compraFormas, compraModalidades, compraPeriodos, empresaPorte, esferas, situacoesLicitacoes, unidadesFederativas])

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
            <SearchItensLicitacaoForm
              empresaPorte={empresaPorte}
              esferas={esferas}
              compraFormas={compraFormas}
              compraModalidades={compraModalidades}
              compraPeriodos={compraPeriodos}
              situacoesLicitacoes={situacoesLicitacoes}
              unidadesFederativas={unidadesFederativas}
              anosCompras={anosCompras}
              />
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default PageClient;