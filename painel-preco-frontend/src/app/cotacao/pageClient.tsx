"use client";

import { Button, Card, CardBody, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import SearchItensLicitacaoForm, { IPropsSearchItensLicitacaoForm } from "./searchItensLicitacaoForm";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { addSnackError, addSnackIfSelectEmpty } from "@/utils/snackbarUtils";
import FormRow from "@/components/atoms/FormRow";
import FormTitle from "@/components/atoms/FormTitle";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { logoutAction } from "../action/logoutActions";
import { CheckRolesStrategy, checkAccessRoles } from "@/utils/sessionTokenAccessor";
import { messages } from "@/utils/messages";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import NoSSR from "@/components/atoms/NoSSR";
import { getUserCartBySession } from "@/utils/cartUtils";

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
  session,
  accessToken,
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
  }, [_cartList])
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();
  const hasAuthorization = checkAccessRoles(session, [], CheckRolesStrategy.INCLUDES_ALL);

  useEffect(() => {
    if (!hasAuthorization) {
      addSnackError(enqueueSnackbar, messages.AUTH_ERROR_UNAUTHORIZED);
      logoutAction();
    } else {
      addSnackIfSelectEmpty(enqueueSnackbar, "Anos da Compra", anosCompras);
      addSnackIfSelectEmpty(enqueueSnackbar, "Portes das Empresas", empresaPorte);
      addSnackIfSelectEmpty(enqueueSnackbar, "Esferas", esferas);
      addSnackIfSelectEmpty(enqueueSnackbar, "Formas de Compra", compraFormas);
      addSnackIfSelectEmpty(enqueueSnackbar, "Modalidades de Compra", compraModalidades);
      addSnackIfSelectEmpty(enqueueSnackbar, "Períodos de Compra", compraPeriodos);
      addSnackIfSelectEmpty(enqueueSnackbar, "Situações das Licitações", situacoesLicitacoes);
      addSnackIfSelectEmpty(enqueueSnackbar, "Unidades Federativas", unidadesFederativas);
    }
  }, [enqueueSnackbar, session, hasAuthorization, anosCompras, compraFormas, compraModalidades, compraPeriodos, empresaPorte, esferas, situacoesLicitacoes, unidadesFederativas])

  const items = [
    {
      key: '1',
      href: '/cotacao',
      label: "Última Cotação Realizada",
    },
    // {
    //   key: '2',
    //   href: '/cotacao?ano=2014&periodoCompraId=181',
    //   label: "Cotações de 2014 (Há mais de 180 dias)",
    // },
    // {
    //   key: '3',
    //   href: '/cotacao?ano=2015&periodoCompraId=181&ufId=e1b49932-4f86-11ee-8095-0242ac120003',
    //   label: "Cotações no Piauí em 2015",
    // },
  ];

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        
        <Card className="mx-1">
          <CardBody>
            <section className='container flex flex-col items-start justify-start'>
              <FormTitle title="Realizar Cotação" isNoSSR={true}>
                <Button className="force-text-transform-none" color="secondary" type="button" as={Link} href="/cotacao/validacao">
                  Validar Cotação
                </Button>
                <Button className="force-text-transform-none" color="primary" type="button" as={Link} href="/carrinho" isDisabled={cartsize < 1}>
                  Ir para o Carrinho
                </Button>
              </FormTitle>

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
                  {/* <div className="flex flex-1  flex-col border-small rounded-small border-default-200 dark:border-default-100 w-full">
                    <h3 className={`text-sm font-bold uppercase text-primary-600 w-full bg-opacity-5 bg-primary-300 p-4 text-center`}>
                      Cotações Favoritas da Equipe
                    </h3>
                    <div className="w-full flex-1 p-4 text-center text-small text-gray-400 cursor-default">
                        Sem Cotações Salvas
                    </div>
                  </div> */}
                </div>
                <div className="flex flex-col items-start justify-start basis-3/4 w-full">
                  <SearchItensLicitacaoForm
                    session={session}
                    accessToken={accessToken}
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
            </section>
          </CardBody>
        </Card>
        
      </div>
    </section>
  );
}

export default PageClient;