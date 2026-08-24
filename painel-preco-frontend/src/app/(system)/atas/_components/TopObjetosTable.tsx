"use client";

import type { AtaTopObjetoItem } from "./types";

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

interface Props {
  items: AtaTopObjetoItem[];
  isLoading: boolean;
}

export function TopObjetosTable({ items, isLoading }: Props) {
  const maxAtas = items[0]?.totalAtas ?? 1;

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Top Objetos por Cobertura</h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-foreground font-medium truncate flex-1" title={item.descricao}>
                  {item.descricao}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-muted-foreground tabular-nums">
                    {item.totalAtas} atas
                  </span>
                  <span className="font-semibold text-foreground tabular-nums w-20 text-right">
                    {fmtMoeda(item.valorTotal)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${(item.totalAtas / maxAtas) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
