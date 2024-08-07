"use client";

import { IRetornoPesquisaItensLicitacao, IReturnRequestAPI } from "@/interfaces/types";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ItemListLicitacao from "./ItemListLicitacao";
import PaginationFooter from "../molecules/PaginationFooter";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import LoadingList from "../molecules/LoadingList";
import { isClientNextjs } from "@/utils/validateUtils";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import { useSnackbar } from "notistack";
import EmptyListText from "../atoms/EmptyListText";
import ResizebleScroll from "../molecules/ResizebleScroll";
import { apiClientPostSearchListItens } from "@/hooks/apiclient";

const ListItemLicitacao: React.FC = () => {
  
  const router = useRouter();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [itensLicitacao, setItensLicitacao] = useState<IRetornoPesquisaItensLicitacao[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading ? setIsLoading(true) : null;
        
        const req: IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null = await apiClientPostSearchListItens(searchParamsToInfo(searchParams));
        
        setIsLoading ? setIsLoading(false) : null;
        if (req?.content) {
          // console.log(req)
          setPaginationInfo(req);
          setItensLicitacao(req?.content)
        }
      }
    }
    fetchData().catch(e => {
      catchErrorFromFetch(e, enqueueSnackbar, 'carregar item');
    });
  }, [searchParams, router, setItensLicitacao, enqueueSnackbar]);

  const hastItens = () => {
    return itensLicitacao != null && itensLicitacao.length > 0;
  }

  return (
    <>
      { !hastItens() ?
        <>
          { isLoading ? 
            <LoadingList/>
          : 
            <EmptyListText>
              Sem resultados de buscas... Realize uma cotação rápida
            </EmptyListText>
          }
        </>
      :
        <div className='flex flex-col w-full items-start justify-start'>
          <ResizebleScroll isLoading={isLoading}>
            { itensLicitacao.map(i =>
              <ItemListLicitacao key={i.uuid} item={i} setIsLoading={setIsLoading} />
            )}
          </ResizebleScroll>
          <Divider className="my-4" />
          <PaginationFooter setIsLoading={setIsLoading} isLoading={isLoading} paginationInfo={paginationInfo} searchParams={searchParams} />
        </div>
      }
    </>
  )
}

export default ListItemLicitacao;