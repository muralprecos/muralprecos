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
import { useSnackbar } from "notistack";
import { catchErrorFromFetch, searchParamsToInfo } from "@/utils/requestUtils";
import { isClientNextjs } from "@/utils/validateUtils";
import { apiClientPostSearchListItens } from "@/hooks/apiclient";
import ItemListLicitacao from "@/components/organisms/ItemListLicitacao";
import PaginationFooter from "@/components/molecules/PaginationFooter";
import LoadingList from "@/components/molecules/LoadingList";
import EmptyListText from "@/components/atoms/EmptyListText";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/molecules/NotifyToast";
import FormTitle from "@/components/atoms/FormTitle";
import { parseNumber } from "@/utils/stringUtils";
import { ROUTE_NOVA_COTACAO } from "@/components/atoms/Buttons";

const ListItemLicitacao: React.FC = () => {
  const router = useRouter();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const isInitialLoad = useRef(true);

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
    <div className="p-6">
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
              {/* Lista de itens com rolagem interna */}
              {/* <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent"> */}
              {itensLicitacao.map((item) => (
                <ItemListLicitacao
                  key={item.uuid}
                  item={item}
                  setIsLoading={setIsLoading}
                  mode="list"
                />
              ))}
              {/* </div> */}

              {/* Paginação fora da rolagem */}
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
};

export default ListItemLicitacao;
