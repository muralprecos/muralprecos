"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ReadonlyURLSearchParams } from "next/navigation";
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

function PaginationFooter<T>({
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
    `${paginationInfo ? paginationInfo.number + 1 + "" : ""}`
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

  const generatePageNumbers = () => {
    if (!paginationInfo) return [];
    const pages = [];
    const totalPages = paginationInfo.totalPages;
    const currentPage = paginationInfo.number + 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t mt-2 transition-opacity ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Página</span>
        <Badge variant="outline">{pageSelected}</Badge>
        <span className="text-sm text-muted-foreground">
          de {parseNumber(paginationInfo?.totalPages)} (
          {parseNumber(paginationInfo?.totalElements)} itens)
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Itens por Página
          </span>
          <Select
            value={selectedValue}
            onValueChange={(value) => {
              setSelectedValue(value);
              changeSize(value);
            }}
          >
            <SelectTrigger className="w-20">
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canDecrement()}
          onClick={() => changeToPage(paginationInfo!.number - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>

        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={
                page === paginationInfo!.number + 1 ? "default" : "outline"
              }
              size="lg"
              className="w-8 h-8"
              disabled={page === "..."}
              onClick={() => typeof page === "number" && changeToPage(page - 1)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!canIncrement()}
          onClick={() => changeToPage(paginationInfo!.number + 1)}
        >
          Próxima <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default PaginationFooter;
