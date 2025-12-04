import { Search, Filter, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cotacao, Licitacao } from "@/utils/dashboard";

interface RecentActivitiesProps {
  licitacoes: Licitacao[];
  cotacoes: Cotacao[];
}

const statusStyles: Record<string, string> = {
  "Divulgada no PNCP": "text-success",
  Aberta: "text-success",
  Concluída: "text-success",
  "Em andamento": "text-warning",
  Pendente: "text-warning",
  Finalizada: "text-muted-foreground",
  "Em análise": "text-primary",
};

function formatCurrency(value: number | null): string {
  if (value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function truncateText(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function RecentActivities({
  licitacoes,
  cotacoes,
}: RecentActivitiesProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Licitações Table */}
      <div
        className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Licitações</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar"
                className="pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20 w-32"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Nº
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Objeto
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {licitacoes.map((licitacao) => (
                <tr
                  key={licitacao.uuid}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2">
                    <span className="text-foreground font-medium">
                      {truncateText(licitacao.numero, 15)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-foreground" title={licitacao.objeto}>
                      {truncateText(licitacao.objeto, 40)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-foreground font-medium">
                      {formatCurrency(licitacao.valor)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        statusStyles[licitacao.status] ||
                          "text-muted-foreground"
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {truncateText(licitacao.status, 20)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cotações Table */}
      <div
        className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Cotações</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar"
                className="pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20 w-32"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Nome
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Criado em
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {cotacoes.map((cotacao) => (
                <tr
                  key={cotacao.uuid}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2">
                    <span className="text-foreground" title={cotacao.nome}>
                      {truncateText(cotacao.nome, 35)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-muted-foreground">
                      {cotacao.criadoEm}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-foreground font-medium">
                      {formatCurrency(cotacao.valor)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        statusStyles[cotacao.status || "Pendente"]
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {cotacao.status || "Pendente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
