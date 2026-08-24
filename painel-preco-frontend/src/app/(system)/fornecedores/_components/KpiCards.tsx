"use client";

import { Building2, FileText, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { FornecedorKpi } from "./types";

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

function fmtVariacao(v: number | null | undefined) {
  if (v == null || isNaN(v)) return "N/A";
  const pct = v * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function trend(v: number | null | undefined): "up" | "down" | "neutral" {
  if (v == null || isNaN(v) || v === 0) return "neutral";
  return v > 0 ? "up" : "down";
}

function TrendIcon({ t }: { t: "up" | "down" | "neutral" }) {
  if (t === "up") return <TrendingUp className="w-3 h-3 mr-1" />;
  if (t === "down") return <TrendingDown className="w-3 h-3 mr-1" />;
  return <Minus className="w-3 h-3 mr-1" />;
}

function trendColor(t: "up" | "down" | "neutral", primary = false) {
  if (primary) return "text-white/90";
  if (t === "up") return "text-emerald-600 dark:text-emerald-400";
  if (t === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

interface Props {
  kpi: FornecedorKpi | null;
  isLoading: boolean;
}

export function KpiCards({ kpi, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl p-5 bg-card shadow-sm border h-32 animate-pulse">
            <div className="h-4 w-1/2 bg-muted rounded mb-4" />
            <div className="h-8 w-1/3 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const safeKpi: FornecedorKpi = kpi ?? {
    totalFornecedores: 0,
    fornecedoresMes: 0,
    fornecedoresMesVariacao: 0,
    totalContratos: 0,
    valorTotal: 0,
    valorMes: 0,
    valorMesVariacao: 0,
  };

  const cards = [
    {
      title: "Fornecedores",
      value: safeKpi.totalFornecedores.toLocaleString("pt-BR"),
      sub: `${safeKpi.fornecedoresMes.toLocaleString("pt-BR")} este mês`,
      variacao: fmtVariacao(safeKpi.fornecedoresMesVariacao),
      t: trend(safeKpi.fornecedoresMesVariacao),
      icon: Building2,
      primary: true,
    },
    {
      title: "Contratos Vencidos",
      value: safeKpi.totalContratos.toLocaleString("pt-BR"),
      sub: "Total homologados",
      variacao: null,
      t: "neutral" as const,
      icon: FileText,
      primary: false,
    },
    {
      title: "Valor Total",
      value: fmtMoeda(safeKpi.valorTotal),
      sub: "Soma itens adjudicados",
      variacao: null,
      t: "neutral" as const,
      icon: DollarSign,
      primary: false,
    },
    {
      title: "Valor Este Mês",
      value: fmtMoeda(safeKpi.valorMes),
      sub: "Adjudicado no mês",
      variacao: fmtVariacao(safeKpi.valorMesVariacao),
      t: trend(safeKpi.valorMesVariacao),
      icon: DollarSign,
      primary: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
            card.primary
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <p className={`text-sm font-medium ${card.primary ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              {card.title}
            </p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.primary ? "bg-white/20 text-white" : "bg-secondary text-foreground"}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
          <div className="mt-3 flex items-center text-xs">
            {card.variacao && (
              <span className={`flex items-center font-medium ${trendColor(card.t, card.primary)}`}>
                <TrendIcon t={card.t} />
                {card.variacao}
              </span>
            )}
            <span className={`${card.variacao ? "ml-2" : ""} ${card.primary ? "text-white/60" : "text-muted-foreground"}`}>
              {card.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
