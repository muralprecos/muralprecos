'use client'

import { Button, Pagination } from "@nextui-org/react";
import FormRow from "../atoms/FormRow";
import { IAPISearchInfo, IReturnRequestAPI } from "@/interfaces/types";
import { ReadonlyURLSearchParams, usePathname, useRouter } from 'next/navigation';
import { mountUrl, searchParamsToInfo } from "@/utils/requestUtils";
import { forceParamSearch } from "@/utils/searchParamUtils";

interface IPropsPageCotacaoListagem<T> {
  paginationInfo: IReturnRequestAPI<T>|null|undefined,
  searchParams: ReadonlyURLSearchParams
}

function PaginationFooter<T extends any>({
  paginationInfo,
  searchParams,
  ...opts
} : IPropsPageCotacaoListagem<T>) {

  const router = useRouter();
  const pathname = usePathname();

  const canDecrement = (): boolean  => {
    return paginationInfo != null && paginationInfo.number > 0;
  }

  const decrementPage = () => {
    if (paginationInfo != null && canDecrement()) {
      changeToPage(paginationInfo.number-1);
    }
  }

  const canIncrement = (): boolean  => {
    return paginationInfo != null && paginationInfo.number < paginationInfo.totalPages-1;
  }

  const incrementPage = () => {
    if (paginationInfo != null && canIncrement()) {
      changeToPage(paginationInfo.number+1);
    }
  }

  const firstPage = () => {
    changeToPage(0);
  }

  const lastPage = () => {
    if (paginationInfo != null) {
      changeToPage(paginationInfo.totalPages);
    }
  }

  const changeToPage = (newpage : number) => {
    let info : IAPISearchInfo[] = searchParamsToInfo(searchParams);
    info = forceParamSearch(info, 'page', newpage+'');
    router.push(mountUrl({
      host: '',
      path: pathname,
      info
    }));
  };

  return (
    <FormRow className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-small text-default-500">Página Atual: {paginationInfo ? paginationInfo.number+1 : ''} de {paginationInfo?.totalPages} ({paginationInfo?.totalElements} itens)</p>
        <p className="text-small text-default-500">Itens por Página: {paginationInfo?.size}</p>
      </div>
      { paginationInfo &&
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            className={`hidden sm:block`}
            isDisabled={!canDecrement()}
            onPress={decrementPage}
          >
            Anterior
          </Button>
          <Pagination
            total={paginationInfo.totalPages}
            color="primary"
            page={paginationInfo?.number+1}
            onChange={(n) => {
              changeToPage(n-1);
            }}/>
          
          <Button
            size="sm"
            variant="flat"
            color="primary"
            className={`hidden sm:block`}
            isDisabled={!canIncrement()}
            onPress={incrementPage}
          >
            Próxima
          </Button>
        </div>
      }
    </FormRow>
  )
}

export default PaginationFooter;