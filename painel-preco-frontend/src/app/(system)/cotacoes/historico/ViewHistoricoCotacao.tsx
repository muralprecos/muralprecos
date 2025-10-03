"use client";

import { IHistoricoCotacao, IReturnRequestAPI } from "@/interfaces/types";
import { useEffect, useState } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { isClientNextjs } from "@/utils/validateUtils";
import { useSnackbar } from "notistack";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import LoadingList from "@/components/molecules/LoadingList";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import ItemHistoricoCotacao from "@/components/organisms/ItemHistoricoCotacao";
import EmptyListText from "@/components/atoms/EmptyListText";
import { apiClientPostSearchHistoricoCotacoes } from "@/hooks/apiclient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import FormTitle from "@/components/atoms/FormTitle";

export default function ViewHistoricoCotacao() {
  const router = useRouter();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<IHistoricoCotacao[]>([]);
  const [paginationInfo, setPaginationInfo] =
    useState<IReturnRequestAPI<IHistoricoCotacao> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading ? setIsLoading(true) : null;
        const req: IReturnRequestAPI<IHistoricoCotacao> | null =
          await apiClientPostSearchHistoricoCotacoes(
            5,
            searchParamsToInfo(searchParams)
          );
        setIsLoading ? setIsLoading(false) : null;
        if (req?.content) {
          // console.log(req)
          setPaginationInfo(req);
          setCotacoes(req?.content);
        }
      }
    };
    fetchData().catch((e) => {
      catchErrorFromFetch(e, "carregar item");
    });
  }, [router, searchParams, enqueueSnackbar]);

  const hasItens = cotacoes?.length > 0;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <FormTitle
              newQuoteButton={true}
              title="Histórico de Cotações"
              description={`${
                hasItens ? cotacoes.length : 0
              } cotações encontradas.`}
              backButton={true}
              uppercase={false}
              icon={<History className="h-5 w-5" />}
            />
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingList />
          ) : !hasItens ? (
            <EmptyListText>
              Sem cotações no Histórico... Realize uma cotação rápida.
            </EmptyListText>
          ) : (
            <>
              {/* Lista com rolagem interna */}
              <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
                {cotacoes.map((item) => (
                  <ItemHistoricoCotacao key={item.uuid} item={item} />
                ))}
              </div>

              {/* Paginação fora da rolagem */}
              <div className="mt-4">
                <PaginationFooter
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  paginationInfo={paginationInfo}
                  searchParams={searchParams}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
