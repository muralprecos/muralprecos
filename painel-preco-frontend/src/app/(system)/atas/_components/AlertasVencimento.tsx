"use client";

import { AlertTriangle, Clock } from "lucide-react";
import type { AtaAlertaVencimento } from "./types";

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

function urgencyClass(dias: number) {
  if (dias <= 7) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800";
  if (dias <= 15) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
  return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
}

interface Props {
  items: AtaAlertaVencimento[];
  isLoading: boolean;
}

export function AlertasVencimento({ items, isLoading }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-base font-semibold text-foreground">Atas Vencendo em Breve</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhuma ata vencendo nos próximos 30 dias</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.numeroPncp}
              className="rounded-xl border p-3.5 space-y-1.5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-foreground line-clamp-2 flex-1">
                  {item.objeto}
                </p>
                <span className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${urgencyClass(item.diasRestantes)}`}>
                  <Clock className="w-3 h-3" />
                  {item.diasRestantes}d
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{item.orgaoGerenciador}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{item.numeroPncp}</span>
                <span className="font-semibold text-foreground">{fmtMoeda(item.valorTotal)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
