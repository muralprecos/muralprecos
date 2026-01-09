import { Search, Filter, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Cotacao, Licitacao } from "@/utils/dashboard";

interface RecentActivitiesProps {
  licitacoes: Licitacao[];
  cotacoes: Cotacao[];
}

const statusStyles: Record<string, string> = {
  "Divulgada no PNCP": "text-emerald-600 dark:text-emerald-400",
  Aberta: "text-emerald-600 dark:text-emerald-400",
  Concluída: "text-emerald-600 dark:text-emerald-400",
  "Em andamento": "text-amber-600 dark:text-amber-400",
  Pendente: "text-amber-600 dark:text-amber-400",
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
    <div
      className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <Tabs defaultValue="licitacoes" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="licitacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Licitações
            </TabsTrigger>
            <TabsTrigger value="cotacoes" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Cotações
            </TabsTrigger>
          </TabsList>

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

        <TabsContent value="licitacoes" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Objeto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licitacoes.map((licitacao) => (
                <TableRow key={licitacao.uuid}>
                  <TableCell className="font-medium">
                    {truncateText(licitacao.numero, 15)}
                  </TableCell>
                  <TableCell title={licitacao.objeto}>
                    {truncateText(licitacao.objeto, 40)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(licitacao.valor)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="cotacoes" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotacoes.map((cotacao) => (
                <TableRow key={cotacao.uuid}>
                  <TableCell title={cotacao.nome}>
                    {truncateText(cotacao.nome, 35)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cotacao.criadoEm}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(cotacao.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
