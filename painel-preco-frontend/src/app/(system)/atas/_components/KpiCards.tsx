"use client";

import { ScrollText, AlertTriangle, DollarSign, Package } from "lucide-react";
import type { AtaKpi } from "./types";

function fmtMoeda(v: number) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

interface Props {
  kpi: AtaKpi | null;
  isLoading: boolean;
}

export function KpiCards({ kpi, isLoading }: Props) {
  if (isLoading || !kpi) {
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

  const cards = [
    {
      title: "Atas Ativas",
      value: kpi.totalAtasAtivas.toLocaleString("pt-BR"),
      sub: "Com vigência em curso",
      icon: ScrollText,
      primary: true,
      accent: null as string | null,
    },
    {
      title: "Vencendo em 30 dias",
      value: kpi.atasVencendo30d.toLocaleString("pt-BR"),
      sub: "Requerem atenção",
      icon: AlertTriangle,
      primary: false,
      accent: kpi.atasVencendo30d > 50 ? "text-amber-600 dark:text-amber-400" : null,
    },
    {
      title: "Valor Registrado",
      value: fmtMoeda(kpi.valorTotalRegistrado),
      sub: "Soma das atas ativas",
      icon: DollarSign,
      primary: false,
      accent: null,
    },
    {
      title: "Itens Cobertos",
      value: kpi.totalItensCobertos.toLocaleString("pt-BR"),
      sub: "Itens com ata ativa",
      icon: Package,
      primary: false,
      accent: null,
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
          <h3 className={`text-2xl font-bold tracking-tight ${card.accent ?? ""}`}>
            {card.value}
          </h3>
          <p className={`mt-3 text-xs ${card.primary ? "text-white/60" : "text-muted-foreground"}`}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
