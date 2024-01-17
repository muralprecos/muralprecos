"use client";

import { Card, CardBody, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { addSnackIfSelectEmpty } from "@/utils/snackbarUtils";
import FormRow from "@/components/atoms/FormRow";
import FormTitle from "@/components/atoms/FormTitle";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();

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

  const items = [
    {
      key: '1',
      href: '/cotacao?ano=2015',
      label: "Cotações de 2015",
    },
    {
      key: '2',
      href: '/cotacao?ano=2014',
      label: "Cotações de 2014",
    },
    {
      key: '3',
      href: '/cotacao?ano=2016',
      label: "Cotações de 2016",
    },
  ];

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
            <div className='container flex flex-col items-start justify-start'>
              <FormTitle className='text-lg font-bold uppercase text-primary'>Realizar Cotação</FormTitle>
              <Divider className="my-4" />
              <FormRow className="flex lg:flex-row flex-col w-full items-start justify-start gap-4">
                <div className='flex flex-col items-start justify-start basis-1/4 gap-2 w-full mt-3'>
                  <div className="flex flex-1  flex-col border-small rounded-small border-default-200 dark:border-default-100 w-full">
                    <h3 className={`text-sm font-bold uppercase text-primary-600 w-full bg-opacity-5 bg-primary-300 p-4 text-center`}>
                      Minhas Cotações Favoritas
                    </h3>
                    <Listbox
                      aria-label="Seleção do Tipo de Visualização"
                      variant="flat"
                      className="w-full flex-1"
                      disallowEmptySelection
                      selectionMode="single"
                      items={items}
                    >
                      {items.map((item) => (
                        <ListboxItem key={item.key} href={item.href}>
                          {item.label}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                  <div className="flex flex-1  flex-col border-small rounded-small border-default-200 dark:border-default-100 w-full">
                    <h3 className={`text-sm font-bold uppercase text-primary-600 w-full bg-opacity-5 bg-primary-300 p-4 text-center`}>
                      Cotações Favoritas da Equipe
                    </h3>
                    <div className="w-full flex-1 p-4 text-center text-small text-gray-400 cursor-default">
                        Sem Cotações Salvos
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start basis-3/4 w-full">
                  <SearchItensLicitacaoForm
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
                </div>
              </FormRow>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default PageClient;