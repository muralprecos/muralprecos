"use client";

import { IRetornoPesquisaItensLicitacao, IReturnRequestAPI } from "@/interfaces/types";
import { Divider, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ItemListLicitacao from "./ItemListLicitacao";
import PaginationFooter from "../molecules/PaginationFooter";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import LoadingList from "../molecules/LoadingList";
import { isClientNextjs } from "@/utils/validateUtils";
import { getPesquisarCotacoes } from "@/hooks/api";
import { searchParamsToInfo } from "@/utils/requestUtils";

interface IProps {
  token: string | null
}

const ListItemLicitacao: React.FC<IProps> = ({
  token
}) => {
  
  const router = useRouter();
  const searchParams : ReadonlyURLSearchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [itensLicitacao, setItensLicitacao] = useState<IRetornoPesquisaItensLicitacao[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null>(null);

  useEffect(() => {
    if (!!token) {
      const fetchData = async () => {
        if (isClientNextjs()) {
          setIsLoading ? setIsLoading(true) : null;
          const req: IReturnRequestAPI<IRetornoPesquisaItensLicitacao>|null = await getPesquisarCotacoes({ info: searchParamsToInfo(searchParams), accessToken: token });
          setIsLoading ? setIsLoading(false) : null;
          if (req?.content) {
            console.log(req)
            setPaginationInfo(req);
            setItensLicitacao(req?.content)
          }
        }
      }
      fetchData().catch(console.error);
    }
  }, [searchParams, router, token, setItensLicitacao]);

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
            <div className='flex flex-col w-full items-start justify-start'>
              <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
            </div>
          }
        </>
      :
        <div className='flex flex-col w-full items-start justify-start'>
          <ScrollShadow className={`h-[400px] w-full ${isLoading ? 'opacity-30': ''}`}>
            { itensLicitacao.map(i =>
              <ItemListLicitacao key={i.uuid} item={i} setIsLoading={setIsLoading} />
            )}
          </ScrollShadow>
          <Divider className="my-4" />
          <PaginationFooter paginationInfo={paginationInfo} searchParams={searchParams} />
        </div>
      }
    </>
  )
}

export default ListItemLicitacao;