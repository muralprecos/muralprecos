"use client";

import { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AtaEvolucaoItem } from "./types";

type Metrica = "fluxo" | "saldo";

interface Props {
  items: AtaEvolucaoItem[];
  ano: number;
  onAnoChange: (ano: number) => void;
  isLoading: boolean;
}

export function EvolucaoChart({ items, ano, onAnoChange, isLoading }: Props) {
  const [metrica, setMetrica] = useState<Metrica>("fluxo");

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-semibold text-foreground">Evolução Mensal de Atas</h3>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden text-xs">
            {(["fluxo", "saldo"] as Metrica[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetrica(m)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  metrica === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {m === "fluxo" ? "Criadas / Encerradas" : "Saldo Ativo"}
              </button>
            ))}
          </div>

          <select
            value={ano}
            onChange={(e) => onAnoChange(Number(e.target.value))}
            className="text-xs border rounded-lg px-2 py-1.5 bg-background text-foreground"
          >
            {[2026, 2025, 2024].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Nenhum dado disponível</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={items} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="mesAno"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={((v: number) => v.toLocaleString("pt-BR")) as any}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />

            {metrica === "fluxo" ? (
              <>
                <Bar dataKey="criadas" name="Criadas" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar dataKey="encerradas" name="Encerradas" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={20} />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="ativas"
                name="Atas Ativas"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#6366f1" }}
                activeDot={{ r: 5 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
