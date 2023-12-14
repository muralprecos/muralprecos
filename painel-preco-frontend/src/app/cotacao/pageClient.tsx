// app/tabs/page.tsx
"use client";

import { Card, CardBody, Skeleton, Tab, Tabs } from "@nextui-org/react";
import {usePathname} from "next/navigation";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";

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

  return (
    <section className='py-4 flex items-center justify-center flex-col'>
      <Tabs aria-label="Options" >
        <Tab key="search" title="Formulário de Busca" >
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
        </Tab>
        <Tab key="result" title="Resultados">
          <Card>
            <CardBody>
              <p>Buscando Itens de Licitação</p>
              <div className="max-w-[300px] w-full flex items-center gap-3">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-4/5 rounded-lg"/>
                  <Skeleton className="h-3 w-3/5 rounded-lg"/>
                  <Skeleton className="h-3 w-5/5 rounded-lg"/>
                  <Skeleton className="h-3 w-4/5 rounded-lg"/>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </section>
  );
}

export default PageClient;