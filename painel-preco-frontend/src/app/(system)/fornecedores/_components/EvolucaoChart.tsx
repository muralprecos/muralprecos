"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FornecedorEvolucaoItem } from "./types";

const ANOS = [2023, 2024, 2025, 2026];

interface Props {
  items: FornecedorEvolucaoItem[];
  ano: number;
  onAnoChange: (ano: number) => void;
  isLoading: boolean;
}

function fmtLabel(v: number) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
  return String(v);
}

export function EvolucaoChart({ items, ano, onAnoChange, isLoading }: Props) {
  const [modo, setModo] = useState<"contratos" | "valor">("contratos");

  const data = items.map((d) => ({
    mes: d.mesAno,
    contratos: d.totalContratos,
    valor: d.valorTotal,
    fornecedores: d.totalFornecedores,
  }));

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-semibold text-foreground">Evolução Mensal</h3>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-border text-xs">
            {(["contratos", "valor"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  modo === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {m === "contratos" ? "Contratos" : "Valor (R$)"}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg overflow-hidden border border-border text-xs">
            {ANOS.map((a) => (
              <button
                key={a}
                onClick={() => onAnoChange(a)}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  a === ano
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-52 bg-muted rounded-lg animate-pulse" />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado para {ano}</p>
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          {modo === "contratos" ? (
            <BarChart data={data} barSize={24}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtLabel} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={((v: number) => [v.toLocaleString("pt-BR"), "Contratos"]) as any}
              />
              <Bar dataKey="contratos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtLabel} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={((v: number) => [`R$ ${fmtLabel(v)}`, "Valor"]) as any}
              />
              <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gradValor)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
