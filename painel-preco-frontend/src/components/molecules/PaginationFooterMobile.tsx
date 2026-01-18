"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  usePathname,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { mountUrl, searchParamsToInfo } from "@/utils/requestUtils";
import { forceParamSearch } from "@/utils/searchParamUtils";
import { IAPISearchInfo, IReturnRequestAPI } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseNumber } from "@/utils/stringUtils";

interface IPropsPageCotacaoListagem<T> {
  paginationInfo: IReturnRequestAPI<T> | null | undefined;
  searchParams: ReadonlyURLSearchParams;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

function PaginationFooterMobile<T>({
  paginationInfo,
  searchParams,
  isLoading,
  setIsLoading,
}: IPropsPageCotacaoListagem<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const sizeOptions = ["5", "10", "20", "50", "100"];

  const initialSize = searchParams.get("size") ?? "5";
  const [selectedValue, setSelectedValue] = useState<string>(initialSize);
  const [pageSelected, setPageSelected] = useState<string>(
    paginationInfo ? `${paginationInfo.number + 1}` : "1"
  );

  const canDecrement = (): boolean => {
    return paginationInfo != null && paginationInfo.number > 0;
  };

  const canIncrement = (): boolean => {
    return (
      paginationInfo != null &&
      paginationInfo.number < paginationInfo.totalPages - 1
    );
  };

  const changeToPage = (newPage: number) => {
    setPageSelected(`${newPage + 1}`);
    changeSearchParams([
      { param: "page", val: newPage < 0 ? "0" : `${newPage}` },
    ]);
  };

  const changeSize = (newSize: string) => {
    setPageSelected("1");
    changeSearchParams([
      { param: "page", val: "0" },
      { param: "size", val: newSize },
    ]);
  };

  const changeSearchParams = (newParams: IAPISearchInfo[]) => {
    setIsLoading(true);
    let info: IAPISearchInfo[] = searchParamsToInfo(searchParams);
    newParams.forEach((np) => {
      info = forceParamSearch(info, np.param, np.val);
    });
    router.push(
      mountUrl({
        host: "",
        path: pathname,
        info,
      })
    );
    setIsLoading(false);
  };

  return (
    <div
      className={`flex flex-col gap-3 pt-4 border-t mt-4 transition-opacity ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Página</span>
        <Badge variant="outline">{pageSelected}</Badge>
        <span className="text-xs text-muted-foreground">
          de {parseNumber(paginationInfo?.totalPages)} (
          {parseNumber(paginationInfo?.totalElements)} itens)
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canDecrement()}
          className="flex-1"
          onClick={() => changeToPage(paginationInfo!.number - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Ant.
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={!canIncrement()}
          className="flex-1"
          onClick={() => changeToPage(paginationInfo!.number + 1)}
        >
          Próx.
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Itens/Pág.</span>
        <Select
          value={selectedValue}
          onValueChange={(value) => {
            setSelectedValue(value);
            changeSize(value);
          }}
        >
          <SelectTrigger className="w-20 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((sizeopt) => (
              <SelectItem key={sizeopt} value={sizeopt}>
                {sizeopt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default PaginationFooterMobile;
