"use client";

import { IHistoricoCotacao, IReturnRequestAPI } from "@/interfaces/types";
import { useEffect, useState } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { isClientNextjs } from "@/utils/validateUtils";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import LoadingList from "@/components/atoms/LoadingList";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import ItemHistoricoCotacao from "@/components/atoms/ItemHistoricoCotacao";
import EmptyListText from "@/components/atoms/EmptyListText";
import { apiClientPostSearchHistoricoCotacoes } from "@/hooks/apiclient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";
import FormTitle from "@/components/atoms/FormTitle";

export default function ViewGerarArtefatos() {
  const router = useRouter();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<IHistoricoCotacao[]>([]);
  const [paginationInfo, setPaginationInfo] =
    useState<IReturnRequestAPI<IHistoricoCotacao> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading(true);
        try {
          const req: IReturnRequestAPI<IHistoricoCotacao> | null =
            await apiClientPostSearchHistoricoCotacoes(
              5,
              searchParamsToInfo(searchParams)
            );

          if (req) {
            setPaginationInfo(req);
            setCotacoes(req.content || []);
          } else {
            setPaginationInfo(null);
            setCotacoes([]);
          }
        } catch (e) {
          catchErrorFromFetch(e, "carregar cotações para geração de artefatos");
          setPaginationInfo(null);
          setCotacoes([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [router, searchParams]);

  const hasItens = cotacoes?.length > 0;

  return (
    <div>
      <Card className="min-h-[560px] flex flex-col">
        <CardHeader>
          <CardTitle>
            <FormTitle
              title="Gerar Artefatos"
              description="Selecione uma cotação para gerar ETP, Termo de Referência e Edital."
              uppercase={false}
              icon={<FileSignature className="h-5 w-5" />}
            />
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingList />
          ) : !hasItens ? (
            <EmptyListText className="flex-col gap-2 py-10 text-center">
              <span>
                Você ainda não possui cotações. É necessário realizar uma cotação antes de gerar artefatos.
              </span>
              <Link
                href="/cotacoes/realizar-cotacao"
                className="text-primary underline underline-offset-4"
              >
                Realizar Cotação
              </Link>
            </EmptyListText>
          ) : (
            <>
              <div className="max-h-[360px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
                {cotacoes.map((item) => (
                  <ItemHistoricoCotacao key={item.uuid} item={item} />
                ))}
              </div>

              {hasItens && paginationInfo && (
                <div className="mt-4">
                  <PaginationFooter
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    paginationInfo={paginationInfo}
                    searchParams={searchParams}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
