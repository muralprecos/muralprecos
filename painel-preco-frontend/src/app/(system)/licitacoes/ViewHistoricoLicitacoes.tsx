"use client";

// 1. Imports de hooks e estado do React
import { useEffect, useState } from "react";

// 2. Imports de UI (shadcn/ui e lucide)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react"; // Ícone para licitações

// 3. Imports dos componentes de layout e estado
import LoadingList from "@/components/molecules/LoadingList";
import EmptyListText from "@/components/atoms/EmptyListText";
import FormTitle from "@/components/atoms/FormTitle";

// 4. Imports para notificações e dados
import { useSnackbar } from "notistack";
import { dashboardMock } from "@/lib/mock"; // Importar o mock para o fallback
import { notify } from "@/components/molecules/NotifyToast";

// 5. Remover imports desnecessários do template original
// (useRouter, useSearchParams, apiClient..., PaginationFooter, IHistorico..., etc.)

// 6. Definir o tipo de dado (baseado no mock)
type Tender = {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string | null;
  valor: number | null;
};

// 7. Definir o tipo da resposta completa da API/mock
type DashboardData = typeof dashboardMock;

// --- Funções Helper (para formatar os dados da API) ---

const getStatusVariant = (
  status: string | null
): "default" | "secondary" | "outline" | "destructive" => {
  if (!status) return "secondary";
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("aberta") || lowerStatus.includes("divulgada"))
    return "default";
  if (lowerStatus.includes("andamento")) return "secondary";
  if (lowerStatus.includes("finalizada") || lowerStatus.includes("concluída"))
    return "outline";
  if (lowerStatus.includes("cancelada") || lowerStatus.includes("falha"))
    return "destructive";
  return "secondary";
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "Valor indef.";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Data indef.";
  // Tentar formatar, se falhar, usar a string original
  try {
    // Assumindo que a data pode não ser um formato JS padrão,
    // mas se for null, já tratamos. Se for 'dd/MM/yyyy' ou ISO,
    // o Date pode ou não funcionar. Ajuste se necessário.
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Retorna original se for data inválida
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    return dateString;
  }
};

// 8. O componente principal
export default function ViewLicitacoes() {
  // 9. Estado para loading e dados
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [licitacoes, setLicitacoes] = useState<Tender[]>([]);

  // 10. useEffect para buscar os dados (lógica do Dashboard)
  useEffect(() => {
    // Função interna para processar os dados
    const handleDashboardData = (data: DashboardData) => {
      if (data && data.ultimasLicitacoes && data.ultimasLicitacoes.content) {
        setLicitacoes(data.ultimasLicitacoes.content);
      } else {
        setLicitacoes([]); // Garante que seja um array
      }
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
        // Fallback para os dados mockados
        handleDashboardData(dashboardMock);

        // Notificar o usuário sobre o fallback
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
  }, []); // Dependência para o notificador

  const hasItens = licitacoes?.length > 0;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {/* 11. Adaptar o FormTitle */}
            <FormTitle
              newQuoteButton={false} // Licitação não cria cotação
              title="Licitações"
              description={`${
                hasItens ? licitacoes.length : 0
              } licitações encontradas.`}
              backButton={true} // Mantido do template
              uppercase={false}
              icon={<FileText className="h-5 w-5" />} // Ícone atualizado
            />
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* 12. Lógica de renderização (mantida do template) */}
          {isLoading ? (
            <LoadingList />
          ) : !hasItens ? (
            <EmptyListText>Nenhuma licitação encontrada.</EmptyListText>
          ) : (
            <>
              {/* Lista com rolagem (mantida do template) */}
              <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
                {/* 13. Renderizar os itens (lógica de 'LatestTenders') */}
                {licitacoes.map((tender) => (
                  <div
                    key={tender.uuid}
                    className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-2">
                        <p className="font-medium text-sm">{tender.numero}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {tender.objeto}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusVariant(tender.status)}
                        className="text-xs text-right whitespace-nowrap"
                      >
                        {tender.status || "Status indef."}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(tender.dataAbertura)}</span>
                      <span className="font-medium">
                        {formatCurrency(tender.valor)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 14. Paginação removida (API do dashboard não é paginada) */}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
