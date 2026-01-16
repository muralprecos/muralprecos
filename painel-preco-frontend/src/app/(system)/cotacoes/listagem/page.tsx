"use client";

import {
  IRetornoPesquisaItensLicitacao,
  IReturnRequestAPI,
} from "@/interfaces/types";
import { useEffect, useRef, useState } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import { isClientNextjs } from "@/utils/validateUtils";
import { apiClientPostSearchListItens } from "@/hooks/apiclient";
import ItemListLicitacao from "@/components/atoms/ItemListLicitacao";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import LoadingList from "@/components/atoms/LoadingList";
import EmptyListText from "@/components/atoms/EmptyListText";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/molecules/NotifyToast";
import FormTitle from "@/components/atoms/FormTitle";
import { parseNumber } from "@/utils/stringUtils";
import { ROUTE_NOVA_COTACAO } from "@/components/atoms/Buttons";
import { PageHeader } from "@/components/molecules/page-header";
import TabelaItensLicitacao from "@/components/atoms/tabela-itens";

export default function ListItemLicitacao() {
  const router = useRouter();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  const [ordenador, setOrdenador] = useState<{
    campo: string;
    direcao: "asc" | "desc";
  } | null>(null);

  const handleOrdenar = (campo: string) => {
    setOrdenador((prev) => {
      if (!prev || prev.campo !== campo) return { campo, direcao: "asc" };
      return { campo, direcao: prev.direcao === "asc" ? "desc" : "asc" };
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [itensLicitacao, setItensLicitacao] = useState<
    IRetornoPesquisaItensLicitacao[]
  >([]);
  const [paginationInfo, setPaginationInfo] =
    useState<IReturnRequestAPI<IRetornoPesquisaItensLicitacao> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading(true);

        const req = await apiClientPostSearchListItens(
          searchParamsToInfo(searchParams)
        );
        setIsLoading(false);

        if (req?.content) {
          setPaginationInfo(req);
          setItensLicitacao(req.content);
        }

        if (isInitialLoad.current) {
          notify(
            "success",
            "Itens encontrados com sucesso!",
            "As informações dos itens foram carregadas."
          );
          isInitialLoad.current = false;
        }
      }
    };

    fetchData().catch((e) => {
      catchErrorFromFetch(e, "carregar item");
    });
  }, [searchParams, router]);

  const hasItens = itensLicitacao?.length > 0;

  return (
    <div>
      <PageHeader
        title="Cotação"
        breadcrumbItems={[
          {
            label: "Realizar Cotação",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Listagem de Itens" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            <FormTitle
              icon={<Package className="h-5 w-5" />}
              title={"Itens Encontrados"}
              description={`${parseNumber(
                paginationInfo?.totalElements ?? 0
              )} itens encontrados para sua
            cotação`}
              cartButton={true}
              backButton={true}
              uppercase={false}
              backButtonOnClick={() => router.push(ROUTE_NOVA_COTACAO)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingList />
          ) : !hasItens ? (
            <div className="flex flex-col items-center gap-4">
              <EmptyListText>
                Sem resultados de buscas... Realize uma cotação rápida
              </EmptyListText>
              <Button onClick={() => router.back()} variant="outline" size="sm">
                Voltar
              </Button>
            </div>
          ) : (
            <>
              <TabelaItensLicitacao
                itens={itensLicitacao}
                ordenador={ordenador}
                onOrdenar={handleOrdenar}
                onSelectItem={(uuid) => router.push(`/cotacoes/${uuid}`)}
                setIsLoading={setIsLoading}
              />
              <div className="">
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
