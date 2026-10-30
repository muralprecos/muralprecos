import type { DashboardResumo } from "@/utils/dashboard";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
  DollarSign,
  Minus,
} from "lucide-react";

interface StatCardsProps {
  resumo: DashboardResumo | null;
  isLoading?: boolean;
}

function formatValue(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return `R$ ${value.toFixed(0)}`;
}

function formatChange(value: number | string): string {
  if (typeof value === "string" && value === "NaN") return "N/A";
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "N/A";
  const percentage = num * 100;
  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
}

function getTrend(value: number | string): "up" | "down" | "neutral" {
  if (typeof value === "string" && value === "NaN") return "neutral";
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "neutral";
  if (num === 0) return "neutral";
  return num > 0 ? "up" : "down";
}

export function StatCards({ resumo, isLoading = false }: StatCardsProps) {
  if (isLoading || !resumo) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-card shadow-sm border h-32 animate-pulse"
          >
            <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-8 w-1/2 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Licitações Este Mês",
      value: resumo.licitacoesMes.toString(),
      change: formatChange(resumo.licitacoesMesComparacao),
      period: "vs mês anterior",
      trend: getTrend(resumo.licitacoesMesComparacao),
      primary: true,
      icon: FileText,
    },
    {
      title: "Cotações Criadas",
      value: resumo.cotacoesCriadas.toString(),
      change: formatChange(resumo.cotacoesCriadasComparacao),
      period: "vs mês anterior",
      trend: getTrend(resumo.cotacoesCriadasComparacao),
      primary: false,
      icon: BarChart3,
    },
    {
      title: "Valor Médio Cotação",
      value: formatValue(resumo.valorMedioCotacao),
      change: formatChange(resumo.valorMedioCotacaoComparacao),
      period: "vs mês anterior",
      trend: getTrend(resumo.valorMedioCotacaoComparacao),
      primary: false,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
            stat.primary
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <p
              className={`text-sm font-medium ${
                stat.primary
                  ? "text-primary-foreground/90"
                  : "text-muted-foreground"
              }`}
            >
              {stat.title}
            </p>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stat.primary
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-foreground"
              }`}
            >
              <stat.icon className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
          </div>

          <div className="mt-4 flex items-center text-xs">
            <span
              className={`flex items-center font-medium ${
                stat.primary
                  ? "text-white/90"
                  : stat.trend === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : stat.trend === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              }`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 w-3 h-3" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="mr-1 w-3 h-3" />
              ) : (
                <Minus className="mr-1 w-3 h-3" />
              )}
              {stat.change}
            </span>
            <span
              className={`ml-2 ${
                stat.primary ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              {stat.period}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
