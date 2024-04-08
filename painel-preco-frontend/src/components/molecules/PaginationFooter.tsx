'use client'

import { Button, Divider, Input, Pagination, Select, SelectItem } from "@nextui-org/react";
import FormRow from "../atoms/FormRow";
import { IAPISearchInfo, IReturnRequestAPI } from "@/interfaces/types";
import { ReadonlyURLSearchParams, usePathname, useRouter } from 'next/navigation';
import { mountUrl, searchParamsToInfo } from "@/utils/requestUtils";
import { forceParamSearch } from "@/utils/searchParamUtils";
import { Dispatch, SetStateAction, useState } from "react";

interface IPropsPageCotacaoListagem<T> {
  paginationInfo: IReturnRequestAPI<T>|null|undefined,
  searchParams: ReadonlyURLSearchParams
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

function PaginationFooter<T extends any>({
  paginationInfo,
  searchParams,
  isLoading,
  setIsLoading,
  ...opts
} : IPropsPageCotacaoListagem<T>) {

  const router = useRouter();
  const pathname = usePathname();
  const sizeOptions = ['5', '10', '20', '50', '100'];

  const [selectedValue, setSelectedValue] = useState<string>(`${paginationInfo?.size || 10}`);
  const [pageSelected, setPageSelected] = useState<string>(`${paginationInfo ? (paginationInfo.number+1)+'' : ''}`);

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
    changeSearchParam('page', (newpage < 0 ? 0 : newpage) +'');
    setPageSelected(`${newpage+1}`);
  };

  const changeSize = (newsize : string) => {
    changeSearchParam('size', newsize);
  };

  const changeSearchParam = (attr: string, val: string) => {
    setIsLoading(true);
    let info : IAPISearchInfo[] = searchParamsToInfo(searchParams);
    info = forceParamSearch(info, attr, val);
    router.push(mountUrl({
      host: '',
      path: pathname,
      info
    }));
    setIsLoading(false);
  };

  return (
    <FormRow className={`flex flex-row items-center justify-between ${isLoading ? 'opacity-30': ''}`}>
      <div className="flex flex-row gap-4 w-full text-center md:justify-start justify-center items-center">
        <div className="flex text-small text-default-500 min-w-0 items-center gap-2 justify-center">
          <span>Página</span>
          <Input 
            className="min-w-16 w-min text-small-important text-default-500"
            fullWidth={false} 
            value={pageSelected}
            variant="underlined"
            type="number"
            min={1}
            max={paginationInfo?.totalPages}
            onChange={(e) => {
              setPageSelected(e.target.value);
            }}
            onFocusChange={(onEl) => {
              if (!onEl) {
                changeToPage(parseInt(pageSelected)-1);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                changeToPage(parseInt(pageSelected)-1);
              }
            }}
            /> 
          <span>de {paginationInfo?.totalPages}</span>
          <span>({paginationInfo?.totalElements} itens)</span>
        </div>

        <Divider className="h-10" orientation="vertical" />

        <Select 
          label="Itens / Página" 
          placeholder="Selecione um valor"
          className="text-small text-default-500 min-w-32 w-auto"
          fullWidth={false}
          defaultSelectedKeys={[selectedValue]}
          onChange={(e) => {
            changeSize(e.target.value);
          }}
        >
          {sizeOptions.map((sizeopt) => (
            <SelectItem key={sizeopt} value={sizeopt} >
              {sizeopt}
            </SelectItem>
          ))}
        </Select>
      </div>
      { paginationInfo &&
        <div className="flex gap-2 w-full md:justify-end justify-center border-gray-200 border-t-1 md:border-none py-3">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            className={`hidden md:block`}
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
            className={`hidden md:block`}
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