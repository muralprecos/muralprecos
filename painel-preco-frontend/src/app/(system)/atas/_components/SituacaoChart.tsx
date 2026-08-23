"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AtaSituacaoItem } from "./types";

const COLORS: Record<string, string> = {
  Vigente: "#10b981",
  Vencida: "#94a3b8",
  Suspensa: "#f59e0b",
  Cancelada: "#f43f5e",
};

const DEFAULT_COLOR = "#6366f1";

interface Props {
  items: AtaSituacaoItem[];
  isLoading: boolean;
}

export function SituacaoChart({ items, isLoading }: Props) {
  const total = items.reduce((s, i) => s + i.total, 0);

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Situação das Atas</h3>

      {isLoading ? (
        <div className="h-56 bg-muted rounded-lg animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={items as any[]}
                dataKey="total"
                nameKey="situacao"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {items.map((item, i) => (
                  <Cell key={i} fill={COLORS[item.situacao] ?? DEFAULT_COLOR} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={((value: number, _name: string, props: any) => [
                  `${value.toLocaleString("pt-BR")} atas`,
                  props.payload.situacao,
                ]) as any}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-2 space-y-1.5">
            {items.map((item) => (
              <div key={item.situacao} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: COLORS[item.situacao] ?? DEFAULT_COLOR }}
                  />
                  <span className="text-muted-foreground">{item.situacao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{item.total.toLocaleString("pt-BR")}</span>
                  <span className="text-muted-foreground tabular-nums w-10 text-right">
                    {total > 0 ? `${((item.total / total) * 100).toFixed(0)}%` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
