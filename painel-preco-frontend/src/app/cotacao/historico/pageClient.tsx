"use client";

import { Divider } from "@nextui-org/react";
import { IHistoricoCotacao, IReturnRequestAPI } from "@/interfaces/types";
import { useEffect, useState } from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { isClientNextjs } from "@/utils/validateUtils";
import { useSnackbar } from "notistack";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import LoadingList from "@/components/molecules/LoadingList";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import ItemHistoricoCotacao from "@/components/organisms/ItemHistoricoCotacao";
import EmptyListText from "@/components/atoms/EmptyListText";
import ResizebleScroll from "@/components/molecules/ResizebleScroll";
import { apiClientPostSearchHistoricoCotacoes } from "@/hooks/apiclient";

const ViewHistoricoCotacao: React.FC = () => {

  const router = useRouter();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<IHistoricoCotacao[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<IReturnRequestAPI<IHistoricoCotacao>|null>(null);

  useEffect(() => {
      const fetchData = async () => {
        if (isClientNextjs()) {
          setIsLoading ? setIsLoading(true) : null;
          const req: IReturnRequestAPI<IHistoricoCotacao>|null = await apiClientPostSearchHistoricoCotacoes(5, searchParamsToInfo(searchParams));
          setIsLoading ? setIsLoading(false) : null;
          if (req?.content) {
            // console.log(req)
            setPaginationInfo(req);
            setCotacoes(req?.content)
          }
        }
      }
      fetchData().catch(e => {
        catchErrorFromFetch(e, enqueueSnackbar, 'carregar item');
      });
  }, [router, searchParams, enqueueSnackbar]);

  const hastItens = () => {
    return cotacoes != null && cotacoes.length > 0;
  }

  return (
    <>
      { !hastItens() ?
        <>
          { isLoading ? 
            <LoadingList/>
          : 
            <EmptyListText>
                Sem cotações no Histórico... Realize uma cotação rápida.
            </EmptyListText>
          }
        </>
      :
        <div className='flex flex-col w-full items-start justify-start'>
          <ResizebleScroll isLoading={isLoading}>
            { cotacoes.map(i =>
              <ItemHistoricoCotacao key={i.uuid} item={i} />
            )}
          </ResizebleScroll>
          <Divider className="my-4" />
          <PaginationFooter setIsLoading={setIsLoading} isLoading={isLoading} paginationInfo={paginationInfo} searchParams={searchParams} />
        </div>
      }
    </>
  );
}

export default ViewHistoricoCotacao;