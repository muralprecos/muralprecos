// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Skeleton, Tab, Tabs } from "@nextui-org/react";
import {usePathname} from "next/navigation";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";
import ListItensLicitacao from "./listItensLicitacao";
import { useState } from "react";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";

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

  const [itens, setItens] = useState<IRetornoPesquisaItensLicitacao[]>([]);
  const [loadingItens, setIsLoadingItens] = useState<boolean>(false);

  const [tabSelected, setTabSelected] = useState("search");

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Tabs aria-label="Options" color="default" variant="solid"
          selectedKey={tabSelected}
          onSelectionChange={(e) => {setTabSelected(e+'')}}>
          <Tab key="search" title="Cotação Rápida" >
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
          <Tab key="result" title="Resultados da Cotação">
            <Card>
              <CardBody>
                <ListItensLicitacao
                  itensLicitacao={itens}
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