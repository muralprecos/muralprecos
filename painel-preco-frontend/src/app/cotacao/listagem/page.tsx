"use client";

import { Button, Card, CardBody, Divider, ScrollShadow } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IRetornoPesquisaItensLicitacao, IReturnRequestAPI } from "@/interfaces/types";
import { useEffect, useState } from "react";
import ClipboardIcon from "@/components/atoms/icons/ClipboardIcon";
import { useTheme } from "next-themes";
import { getPesquisarCotacoes } from "@/hooks/api";
import WallpaperIcon from "@/components/atoms/icons/WallpaperIcon";
import LoadingList from "@/components/molecules/LoadingList";
import CartButton from "@/components/molecules/CartButton";
import { useRouter } from "next/navigation";
import { URLPageCotacaoSearch } from "../pageClient";
import { isClientNextjs } from "@/utils/validateUtils";
import { mountUrl, searchParamsToInfo } from "@/utils/requestUtils";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import { URLPageViewItemLicitacao } from "../[item]/page";

interface IPropsPageCotacaoListagem {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const URLPageCotacaoListagem = '/cotacao/listagem';
const PageCotacaoListagem: React.FC<IPropsPageCotacaoListagem> = ({
  searchParams,
  ...opts
}) => {

  const router = useRouter();
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true);
  const [itensLicitacao, setItensLicitacao] = useState<IRetornoPesquisaItensLicitacao[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null>();

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading ? setIsLoading(true) : null;
        const req: IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null = await getPesquisarCotacoes({ info: searchParamsToInfo(searchParams) });
        setIsLoading ? setIsLoading(false) : null;
        if (req?.content) {
          setPaginationInfo(req);
          setItensLicitacao(req?.content)
        }
      }
    }
    fetchData().catch(console.error);
  }, [searchParams,setItensLicitacao]);

  const hastItens = () => {
    return itensLicitacao != null && itensLicitacao.length > 0;
  }

  const goSearchTab = () => {
    router.push(URLPageCotacaoSearch);
  }

  const selectItem = async (uuid : string) => {
    router.push(mountUrl({
      host: '',
      path: URLPageViewItemLicitacao.replace('[uuid]',uuid)
    }));
  }
  

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
            
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
              { !hastItens() && 
                <div className='flex flex-col w-full items-start justify-start'>
                  { !isLoading ? 
                    <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
                  : 
                    <LoadingList/>
                  }
                </div>
              }
              { hastItens() && 
                <div className='flex flex-col w-full items-start justify-start'>
                  <ScrollShadow className={`h-[400px] w-full ${isLoading ? 'opacity-30': ''}`}>
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
                  <PaginationFooter paginationInfo={paginationInfo} searchParams={searchParams} />
                </div>
              }
            </FormRow>
          </section>

          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default PageCotacaoListagem;