"use client";

import { Divider, ScrollShadow } from "@nextui-org/react";
import { IHistoricoCotacao, IReturnRequestAPI } from "@/interfaces/types";
import { useEffect, useState } from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { isClientNextjs } from "@/utils/validateUtils";
import { getListHistoricoCotacoes } from "@/hooks/api";
import { useSnackbar } from "notistack";
import { Session } from "next-auth";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import LoadingList from "@/components/molecules/LoadingList";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import ItemHistoricoCotacao from "@/components/organisms/ItemHistoricoCotacao";

interface IPropsView {
  session: Session | null
  accessToken: string | null
}

const ViewHistoricoCotacao: React.FC<IPropsView> = ({
  accessToken
}) => {

  const router = useRouter();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<IHistoricoCotacao[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<IReturnRequestAPI<IHistoricoCotacao>|null>(null);

  useEffect(() => {
    if (!!accessToken) {
      const fetchData = async () => {
        if (isClientNextjs()) {
          setIsLoading ? setIsLoading(true) : null;
          const req: IReturnRequestAPI<IHistoricoCotacao>|null = await getListHistoricoCotacoes({  size: 5, info: searchParamsToInfo(searchParams), accessToken });
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
    }
  }, [router, searchParams, enqueueSnackbar, accessToken]);

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
            <div className='flex flex-col w-full items-start justify-start'>
              <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
            </div>
          }
        </>
      :
        <div className='flex flex-col w-full items-start justify-start'>
          <ScrollShadow className={`h-[400px] w-full ${isLoading ? 'opacity-30': ''}`}>
            { cotacoes.map(i =>
              <ItemHistoricoCotacao key={i.uuid} item={i} accessToken={accessToken} />
            )}
          </ScrollShadow>
          <Divider className="my-4" />
          <PaginationFooter setIsLoading={setIsLoading} paginationInfo={paginationInfo} searchParams={searchParams} />
        </div>
      }
    </>
  );
}

export default ViewHistoricoCotacao;