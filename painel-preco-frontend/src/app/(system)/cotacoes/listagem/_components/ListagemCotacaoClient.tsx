"use client";

import {
  IRetornoPesquisaItensLicitacao,
  IReturnRequestAPI,
  type IItemSelect,
} from "@/interfaces/types";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  catchErrorFromFetch,
  mountUrl,
  searchParamsToInfo,
} from "@/utils/requestUtils";

import { isClientNextjs } from "@/utils/validateUtils";
import { apiClientPostSearchListItens } from "@/hooks/apiclient";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import LoadingList from "@/components/atoms/LoadingList";
import EmptyListText from "@/components/atoms/EmptyListText";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/molecules/NotifyToast";
import FormTitle from "@/components/atoms/FormTitle";
import { parseNumber } from "@/utils/stringUtils";
import TabelaItensLicitacao from "@/components/atoms/tabela-itens";
import PaginationFooterMobile from "@/components/molecules/PaginationFooterMobile";

import { FIELDS_COTACOES_LIST } from "@/hooks/api";
import {
  buildBackendParams,
  normalizeLegacySearchParams,
  type CotacaoQueryState,
} from "@/app/(system)/cotacoes/realizar-cotacao/_components/buildBackendParams";
import { paramsToInfo } from "@/app/(system)/cotacoes/realizar-cotacao/_components/paramsToInfo";
import {
  defaultFormValues,
  formValuesToQuery,
  useCotacaoQueryStates,
} from "@/app/(system)/cotacoes/realizar-cotacao/_components/cotacaoQuery";

import {
  forceParamSearch,
  extractParamSearch,
} from "@/utils/searchParamUtils";
import SearchItensLicitacaoForm from "@/app/(system)/cotacoes/realizar-cotacao/_components/searchItensLicitacaoForm";
import AppliedCotacaoFilters from "./AppliedCotacaoFilters";
import type { ClientSession } from "@/interfaces/auth";

type SelectFilterOptions = {
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
};

type ListagemCotacaoClientProps = {
  session: ClientSession | null;
  options: SelectFilterOptions;
};

export default function ListagemCotacaoClient({
  session,
  options,
}: ListagemCotacaoClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const isInitialLoad = useRef(true);
  const [queryState, setQueryState] = useCotacaoQueryStates();
  const [isEditingFilters, setIsEditingFilters] = useState(false);

  const currentSort = searchParams.get("sort") ?? "";

  const handleSortChange = (newSort: string) => {
    let info = searchParamsToInfo(searchParams);
    info = extractParamSearch(info, "sort");
    if (newSort) {
      info = forceParamSearch(info, "sort", newSort);
    }
    info = forceParamSearch(info, "page", "0");
    router.push(mountUrl({ host: "", path: pathname, info }));
  };

  const [isLoading, setIsLoading] = useState(true);
  const [itensLicitacao, setItensLicitacao] = useState<
    IRetornoPesquisaItensLicitacao[]
  >([]);
  const [paginationInfo, setPaginationInfo] =
    useState<IReturnRequestAPI<IRetornoPesquisaItensLicitacao> | null>(null);

  const legacyNormalization = useMemo(
    () => normalizeLegacySearchParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    if (legacyNormalization.changed) {
      const query = legacyNormalization.params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [legacyNormalization, router, pathname]);

  useEffect(() => {
    if (legacyNormalization.changed) return;

    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading(true);

        const page = queryState.page ?? 0;
        const size = queryState.size ?? 5;
        const backendParams = buildBackendParams({ ...queryState, page, size });
        backendParams.set("fields", FIELDS_COTACOES_LIST);

        const req = await apiClientPostSearchListItens(paramsToInfo(backendParams));
        setIsLoading(false);

        if (req?.content) {
          setPaginationInfo(req);
          setItensLicitacao(req.content);
        }

        if (isInitialLoad.current) {
          notify(
            "success",
            "Itens encontrados com sucesso!",
            "As informações dos itens foram carregadas.",
          );
          isInitialLoad.current = false;
        }
      }
    };

    fetchData().catch((e) => {
      catchErrorFromFetch(e, "carregar item");
    });
  }, [queryState, legacyNormalization.changed]);

  const hasItens = itensLicitacao?.length > 0;

  const clearAllFilters = async () => {
    const nextQuery: CotacaoQueryState = {
      ...formValuesToQuery(defaultFormValues),
      sort: null,
      dir: null,
      page: 0,
      size: queryState.size ?? 10,
    };
    await setQueryState(nextQuery as any, { history: "replace" });
  };

  const removeSingleFilter = async (key: keyof CotacaoQueryState) => {
    const nextQuery: CotacaoQueryState = {
      ...queryState,
      [key]: null,
      page: 0,
    };
    await setQueryState(nextQuery as any, { history: "replace" });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <FormTitle
              icon={<Package className="h-5 w-5" />}
              title={"Listagem de Itens"}
              description={`${parseNumber(
                paginationInfo?.totalElements ?? 0,
              )} Itens encontrados`}
              cartButton={true}
              backButton={true}
              uppercase={false}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AppliedCotacaoFilters
            queryState={queryState}
            options={options}
            onRemoveFilter={removeSingleFilter}
            onClearAll={clearAllFilters}
            onEditFilters={() => setIsEditingFilters((prev) => !prev)}
            isEditing={isEditingFilters}
          />

          {isEditingFilters && (
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingFilters(false)}
                  >
                    Fechar edição
                  </Button>
                </div>
                <SearchItensLicitacaoForm
                  session={session}
                  {...options}
                  variant="inline"
                  onAfterSubmit={() => setIsEditingFilters(false)}
                />
              </CardContent>
            </Card>
          )}

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
                onSelectItem={(uuid) => router.push(`/cotacoes/${uuid}`)}
                setIsLoading={setIsLoading}
                currentSort={currentSort}
                onSortChange={handleSortChange}
              />
              <div className="w-full">
                <div className="hidden xl:block">
                  <PaginationFooter
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    paginationInfo={paginationInfo}
                    searchParams={searchParams}
                  />
                </div>

                <div className="block xl:hidden">
                  <PaginationFooterMobile
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    paginationInfo={paginationInfo}
                    searchParams={searchParams}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
