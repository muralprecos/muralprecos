"use client";

import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import {usePathname} from "next/navigation";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";
import ListItensLicitacao from "./listItensLicitacao";
import { useEffect, useState } from "react";
import { IItemLicitacao, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import ViewItemLicitacao from "./viewItemLicitacao";
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
  const pathname = usePathname();
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

  const [itens, setItens] = useState<IRetornoPesquisaItensLicitacao[]>([]);
  const [loadingItens, setIsLoadingItens] = useState<boolean>(false);
  const [item, setItem] = useState<IItemLicitacao|null>(null);

  const [tabSelected, setTabSelected] = useState(TABS_COTACAO.SEARCH.key);

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Tabs aria-label="Options" color="default" variant="solid"
          selectedKey={tabSelected}
          disabledKeys={[TABS_COTACAO.VIEW.key]} 
          onSelectionChange={(e) => {setTabSelected(e+'')}}>
          <Tab key={TABS_COTACAO.SEARCH.key} title={TABS_COTACAO.SEARCH.desc} >
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
                  setItens={setItens}
                  setTabSelected={setTabSelected}
                  setIsLoadingItens={setIsLoadingItens}
                  />
              </CardBody>
            </Card>
          </Tab>
          <Tab key={TABS_COTACAO.LIST.key} title={TABS_COTACAO.LIST.desc}>
            <Card>
              <CardBody>
                <ListItensLicitacao
                  itensLicitacao={itens}
                  isLoading={loadingItens}
                  setIsLoadingItens={setIsLoadingItens}
                  setTabSelected={setTabSelected}
                  setItem={setItem}
                  />
              </CardBody>
            </Card>
          </Tab>
          <Tab key={TABS_COTACAO.VIEW.key} title={TABS_COTACAO.VIEW.desc}>
            <Card>
              <CardBody>
                <ViewItemLicitacao
                  itemLicitacao={item}
                  isLoading={loadingItens}
                  setTabSelected={setTabSelected}
                  />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}

export default PageClient;