"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { FornecedorPorteItem } from "./types";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#94a3b8"];

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

interface Props {
  items: FornecedorPorteItem[];
  isLoading: boolean;
}

export function PorteChart({ items, isLoading }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Distribuição por Porte</h3>

      {isLoading ? (
        <div className="h-56 bg-muted rounded-lg animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={items as any[]}
                dataKey="totalContratos"
                nameKey="porte"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {items.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
                  `${value.toLocaleString("pt-BR")} contratos`,
                  props.payload.porte,
                ]) as any}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-2 space-y-1">
            {items.map((item, i) => (
              <div key={item.porte} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{item.porte}</span>
                </div>
                <span className="font-medium tabular-nums">{fmtMoeda(item.valorTotal)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
