// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, ScrollShadow, Pagination } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Dispatch, SetStateAction, useState } from "react";
import ClipboardIcon from "@/components/atoms/icons/ClipboardIcon";
import { useTheme } from "next-themes";
import { getItemLicitacao } from "@/hooks/api";
import { TABS_COTACAO } from "./pageClient";
import WallpaperIcon from "@/components/atoms/icons/WallpaperIcon";
import LoadingList from "@/components/molecules/LoadingList";
import CartButton from "@/components/molecules/CartButton";

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
  const [currentPage, setCurrentPage] = useState(1);

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
    const req: IItemLicitacao | null = await getItemLicitacao({ info: [{ val: uuid, param: 'uuid' }] });
    if (!!setItem) {
      setIsLoadingItens ? setIsLoadingItens(false) : null;
      setItem(req)
    }
  }

  return (
    <section className='container flex flex-col items-start justify-start'>
        <FormTitle className='text-lg font-bold uppercase text-primary flex flex-row items-center justify-between w-full'>
          <div className="flex-auto">
            Resultado da Cotação
          </div>
          <Button color="secondary" type="button" onClick={goSearchTab}>
            Voltar
          </Button>
        </FormTitle>
        <Divider className="my-4" />
        <FormRow className='flex flex-col items-start justify-start'>
          { isLoading && 
            <LoadingList/>
          }
          { !hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
            </div>
          }
          { hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <ScrollShadow className="h-[400px] w-full">
              { itensLicitacao?.map(i =>
                <div key={i.uuid} className="flex-1 w-full flex-wrap md:flex-nowrap gap-4 py-2">
                  <Card className="bg-default-100/50 flex flex-row mx-4" shadow="sm">
                    <CardBody className="flex-row items-center justify-between">

                      <div className="flex gap-6 md:gap-4 items-center justify-center basis-1/12">
                        <div className="relative col-span-6 md:col-span-4">
                          <WallpaperIcon height={48} width={48}
                            classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                            ></WallpaperIcon>
                        </div>
                      </div>

                      <div className="flex flex-col basis-10/12">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-0">
                            <h3 className="font-semibold text-foreground/90">{i.descricao}</h3>
                            <p className="text-small mt-1 text-foreground/80">
                              Quantidade: {i.quantidade} {i.unidadeFornecimento.nome}
                            </p>
                            <h1 className="text-small font-medium">Valor: {i.valor}</h1>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row gap-3 basis-1/12 items-start justify-start">
                        <CartButton itemRetornoLicitacao={i} isCompact={true} />
                        <Button
                          isIconOnly
                          className="text-default-900/60"
                          radius="full"
                          color="primary"
                          variant="solid"
                          onPress={() => selectItem(i.uuid) }
                        >
                          <ClipboardIcon classNamesArrPath={theme == 'light' ? ['stroke-gray-200'] : []}></ClipboardIcon>
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
              </ScrollShadow>
              <Divider className="my-4" />
              <FormRow className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-small text-default-500">Página Selecionada: {currentPage}</p>
                  <p className="text-small text-default-500">Itens na Página: {itensLicitacao?.length}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                  >
                    Previous
                  </Button>
                  <Pagination
                    total={10}
                    color="primary"
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))}
                  >
                    Next
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