"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import LoadingList from "@/components/molecules/LoadingList";
import EmptyListText from "@/components/atoms/EmptyListText";
import FormTitle from "@/components/atoms/FormTitle";
import { useSnackbar } from "notistack";
import { dashboardMock } from "@/lib/mock";
import { notify } from "@/components/molecules/NotifyToast";
import ItemLicitacao from "@/components/molecules/item-licitacao";

type Licitacao = {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string | null;
  valor: number | null;
};

type DashboardData = typeof dashboardMock;

export default function ViewLicitacoes() {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);

  useEffect(() => {
    const handleDashboardData = (data: DashboardData) => {
      const lista = data?.ultimasLicitacoes?.content;
      setLicitacoes(lista ?? []);
    };

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard");

        if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");

        const data: DashboardData = await res.json();
        handleDashboardData(data);
      } catch (error) {
        console.warn("API falhou, usando dados mockados.", error);

        handleDashboardData(dashboardMock);

        notify(
          "warning",
          "Usando dados mockados",
          "A API não respondeu. Exibindo dados ilustrativos locais."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hasItems = licitacoes.length > 0;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <FormTitle
              newQuoteButton={false}
              title="Licitações"
              description={`${
                hasItems ? licitacoes.length : 0
              } licitações encontradas.`}
              backButton={true}
              uppercase={false}
              icon={<FileText className="h-5 w-5" />}
            />
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingList />
          ) : !hasItems ? (
            <EmptyListText>Nenhuma licitação encontrada.</EmptyListText>
          ) : (
            <div className="max-h-[650px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
              {licitacoes.map((item) => (
                <ItemLicitacao
                  key={item.uuid}
                  uuid={item.uuid}
                  numero={item.numero}
                  objeto={item.objeto}
                  dataAbertura={item.dataAbertura}
                  status={item.status}
                  valor={item.valor}
                  showIcon
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
