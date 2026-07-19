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
  const EDIT_CARD_ANIMATION_MS = 300;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const isInitialLoad = useRef(true);
  const closeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [queryState, setQueryState] = useCotacaoQueryStates();
  const [isEditingFilters, setIsEditingFilters] = useState(false);
  const [isClosingFilters, setIsClosingFilters] = useState(false);

  const sortParam = searchParams.get("sort") ?? "";
  const dirParam = searchParams.get("dir") ?? "";
  const currentSort = sortParam ? (dirParam ? `${sortParam},${dirParam}` : sortParam) : "";

  const handleSortChange = (newSort: string) => {
    let info = searchParamsToInfo(searchParams);
    info = extractParamSearch(info, "sort");
    info = extractParamSearch(info, "dir");
    if (newSort) {
      const parts = newSort.split(",");
      const sortVal = parts[0];
      const dirVal = parts[1];
      if (sortVal) {
        info = forceParamSearch(info, "sort", sortVal);
      }
      if (dirVal) {
        info = forceParamSearch(info, "dir", dirVal);
      }
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



  useEffect(() => {

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
  }, [queryState]);

  useEffect(() => {
    return () => {
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current);
      }
    };
  }, []);

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

  const closeFilterEditor = () => {
    if (!isEditingFilters) return;
    setIsClosingFilters(true);
    closeAnimationTimeoutRef.current = setTimeout(() => {
      setIsEditingFilters(false);
      setIsClosingFilters(false);
      closeAnimationTimeoutRef.current = null;
    }, EDIT_CARD_ANIMATION_MS);
  };

  const openFilterEditor = () => {
    if (closeAnimationTimeoutRef.current) {
      clearTimeout(closeAnimationTimeoutRef.current);
      closeAnimationTimeoutRef.current = null;
    }
    setIsClosingFilters(false);
    setIsEditingFilters(true);
  };

  const toggleFilterEditor = () => {
    if (isEditingFilters) {
      closeFilterEditor();
      return;
    }
    openFilterEditor();
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
        <CardContent className="space-y-8">
          <AppliedCotacaoFilters
            queryState={queryState}
            options={options}
            onRemoveFilter={removeSingleFilter}
            onClearAll={clearAllFilters}
            onEditFilters={toggleFilterEditor}
            isEditing={isEditingFilters}
          />

          {(isEditingFilters || isClosingFilters) && (
            <Card
              className={`bg-muted/20 duration-300 !mb-12 ${
                isClosingFilters
                  ? "animate-out fade-out-0 slide-out-to-top-2"
                  : "animate-in fade-in-0 slide-in-from-top-2"
              }`}
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">
                    Editar Filtros da Cotação
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeFilterEditor}
                  >
                    Fechar edição
                  </Button>
                </div>
                <SearchItensLicitacaoForm
                  session={session}
                  {...options}
                  variant="inline"
                  onAfterSubmit={closeFilterEditor}
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
              <div className="w-full !mt-0">
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
