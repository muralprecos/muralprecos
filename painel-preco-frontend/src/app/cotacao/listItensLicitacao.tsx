// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, ScrollShadow, Skeleton } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Dispatch, SetStateAction } from "react";
import ClipboardIcon from "@/components/atoms/icons/ClipboardIcon";
import EyeIcon from "@/components/atoms/icons/EyeIcon";
import { useTheme } from "next-themes";
import { getItemLicitacao } from "@/hooks/api";
import { TABS_COTACAO } from "./pageClient";

export interface IPropsListItensLicitacao {
  isLoading: boolean
  itensLicitacao: IRetornoPesquisaItensLicitacao[]
  setTabSelected: Dispatch<SetStateAction<string>>
  setIsLoadingItens?: Dispatch<SetStateAction<boolean>>
  setItem: Dispatch<SetStateAction<IItemLicitacao|null>>
}

const ListItensLicitacao: React.FC<IPropsListItensLicitacao> = ({
  isLoading = false,
  itensLicitacao,
  setTabSelected,
  setIsLoadingItens,
  setItem,
  ...opts
}) => {
  const { theme, setTheme } = useTheme()

  const hastItens = () => {
    return itensLicitacao != null && itensLicitacao.length > 0;
  }

  const goSearchTab = () => {
    setTabSelected(TABS_COTACAO.SEARCH.key)
  }

  const selectItem = async (uuid : string) => {
    if (!!setItem) {
      setItem(null)
    }
    if (!!setTabSelected) {
      setTabSelected(TABS_COTACAO.VIEW.key);
    }
    setIsLoadingItens ? setIsLoadingItens(true) : null;

    console.log(uuid)
    const req: IItemLicitacao = await getItemLicitacao({ info: [{ val: uuid, param: 'uuid' }] });
    console.log(req)
    if (!!setItem) {
      setIsLoadingItens ? setIsLoadingItens(false) : null;
      setItem(req)
    }
  }

  return (
    <section className='container flex flex-col items-start justify-start'>
        <FormTitle className='text-lg font-bold uppercase text-primary'>Resultado da Cotação</FormTitle>
        <Divider className="my-4" />
        <FormRow className='flex flex-col items-start justify-start'>
          { isLoading && 
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-4/5 rounded-lg"/>
                <Skeleton className="h-3 w-3/5 rounded-lg"/>
                <Skeleton className="h-3 w-5/5 rounded-lg"/>
                <Skeleton className="h-3 w-4/5 rounded-lg"/>
              </div>
            </div>
          }
          { !hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
              <Divider className="my-4" />
              <FormRow className="flex flex-row items-center justify-end">
                <div className="flex">
                  <Button color="primary" type="button" onClick={goSearchTab}>
                    Nova Cotação
                  </Button>
                </div>
              </FormRow>
            </div>
          }
          { hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <ScrollShadow className="h-[500px] w-full">
              { itensLicitacao?.map(i =>
                <div key={i.uuid} className="flex-1 w-full flex-wrap md:flex-nowrap gap-4 py-2">
                  <Card className="bg-default-100/50 flex flex-row" shadow="sm">
                    <CardBody className="flex-row items-center justify-between">

                      <div className="flex gap-6 md:gap-4 items-center justify-center basis-1/12">
                        <div className="relative col-span-6 md:col-span-4">
                          <ClipboardIcon height={48} width={48}
                            classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                            ></ClipboardIcon>
                        </div>
                      </div>

                      <div className="flex flex-col basis-10/12">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-0">
                          <h3 className="font-semibold text-foreground/90">{i.descricao}</h3>
                          <p className="text-small mt-2 text-foreground/80">Quantidade: {i.quantidade}</p>
                          <h1 className="text-small font-medium">Valor: {i.valor}</h1>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col basis-1/12 items-center">
                        <Button
                          isIconOnly
                          className="text-default-900/60 -translate-y-2 translate-x-2"
                          radius="full"
                          color="primary"
                          variant="solid"
                          onPress={() => selectItem(i.uuid) }
                        >
                          <EyeIcon classNamesArrPath={theme == 'light' ? ['stroke-gray-200'] : []}></EyeIcon>
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
              </ScrollShadow>
              <Divider className="my-4" />
              <FormRow className="flex flex-row items-center justify-between">
                <div className="flex">
                  Itens Retornados: {itensLicitacao?.length}  
                </div>
                <div className="flex">
                  <Button color="primary" type="button" onClick={goSearchTab}>
                    Nova Cotação
                  </Button>
                </div>
              </FormRow>
            </div>
          }
        </FormRow>
      </section>
  );
}

export default ListItensLicitacao;