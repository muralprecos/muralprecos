"use client";

import type { FornecedorRankingItem } from "./types";

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

const BADGE: Record<string, string> = {
  MEI: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  ME: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  EPP: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Grande Empresa": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

function porteBadge(porte: string) {
  const cls = BADGE[porte] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {porte}
    </span>
  );
}

interface Props {
  items: FornecedorRankingItem[];
  isLoading: boolean;
}

export function RankingTable({ items, isLoading }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Top Fornecedores</h3>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">#</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Fornecedor</th>
                <th className="text-left py-2 font-medium text-muted-foreground hidden md:table-cell">Porte</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Contratos</th>
                <th className="text-right py-2 font-medium text-muted-foreground hidden sm:table-cell">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.documento} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-3 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                  <td className="py-2.5 pr-3">
                    <div className="font-medium text-foreground truncate max-w-[180px]" title={item.nome}>
                      {item.nome}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.documento}</div>
                  </td>
                  <td className="py-2.5 pr-3 hidden md:table-cell">{porteBadge(item.porte)}</td>
                  <td className="py-2.5 pr-3 text-right font-semibold tabular-nums">
                    {item.totalContratos.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground hidden sm:table-cell">
                    {fmtMoeda(item.valorTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
