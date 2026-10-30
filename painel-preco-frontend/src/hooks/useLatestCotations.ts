import { useEffect, useState } from "react";
import { IHistoricoCotacao, IReturnRequestAPI } from "@/interfaces/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { isClientNextjs } from "@/utils/validateUtils";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import { apiClientPostSearchHistoricoCotacoes } from "@/hooks/apiclient";
import { useSnackbar } from "notistack";

export function useLatestCotations(searchParams: ReadonlyURLSearchParams) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<IHistoricoCotacao[]>([]);
  const [paginationInfo, setPaginationInfo] =
    useState<IReturnRequestAPI<IHistoricoCotacao> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isClientNextjs()) return;

      try {
        setIsLoading(true);
        const req = await apiClientPostSearchHistoricoCotacoes(
          5,
          searchParamsToInfo(searchParams)
        );
        if (req?.content) {
          setPaginationInfo(req);
          setCotacoes(req.content);
        } else {
          setCotacoes([]);
        }
      } catch (e) {
        catchErrorFromFetch(e, "carregar item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, enqueueSnackbar]);

  return { isLoading, cotacoes, paginationInfo, setIsLoading };
}
