import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DadosMensais, DashboardResumo } from "@/utils/dashboard";
import { LineChartSkeleton } from "@/components/atoms/Line-chart-skeleton";

interface LineChartDashboardProps {
  data: DadosMensais[];
  resumo: DashboardResumo;
  isLoading?: boolean;
}

const periods = ["1D", "1W", "1M", "1Y", "All"];

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
  return value.toString();
}

export default function LineChartDashboard({
  data,
  resumo,
  isLoading = false,
}: LineChartDashboardProps) {
  const [activePeriod, setActivePeriod] = useState("1Y");

  if (isLoading || !resumo || !data) {
    return <LineChartSkeleton />;
  }

  const chartData = data.map((item) => ({
    month: item.mes.split("/")[0] + "/" + item.mes.split("/")[1].slice(2),
    licitacoes: item.volumeLicitacoes,
    cotacoes: item.valorCotacoes,
  }));

  // Helper para garantir que o valor seja numérico antes de usar em cálculos
  const licitacoesCompValue = Number(resumo?.licitacoesMesComparacao);
  const safeLicitacoesComp = isNaN(licitacoesCompValue)
    ? 0
    : licitacoesCompValue;

  const cotacoesCompValue = Number(resumo?.cotacoesCriadasComparacao);
  const safeCotacoesComp = isNaN(cotacoesCompValue) ? 0 : cotacoesCompValue;

  const summaryStats = [
    {
      title: "Licitações Este Mês",
      value: resumo?.licitacoesMes?.toString() || "0",
      change:
        safeLicitacoesComp >= 0
          ? `+${(safeLicitacoesComp * 100).toFixed(1)}%`
          : `${(safeLicitacoesComp * 100).toFixed(1)}%`,
      highlighted: true,
    },
    {
      title: "Cotações Criadas",
      value: resumo?.cotacoesCriadas?.toString() || "0",
      change: !isNaN(cotacoesCompValue)
        ? `${(safeCotacoesComp * 100).toFixed(1)}%`
        : "N/A",
      highlighted: false,
    },
  ];

  if (!resumo) return null;

  return (
    <div
      className="bg-card rounded-2xl p-6 shadow-card animate-fade-in h-full"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h3 className="font-semibold text-foreground text-lg">Volume Mensal</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all",
                  activePeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>2024 - 2025</span>
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stats Column */}
        <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[180px]">
          {summaryStats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "rounded-xl p-4 flex-1 lg:flex-none",
                stat.highlighted
                  ? "bg-sidebar text-sidebar-foreground"
                  : "bg-muted/50"
              )}
            >
              <p
                className={cn(
                  "text-sm mb-1",
                  stat.highlighted
                    ? "text-sidebar-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {stat.title}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xl font-bold",
                    stat.highlighted
                      ? "text-sidebar-foreground"
                      : "text-foreground"
                  )}
                >
                  {stat.value}
                </span>

                {/* PARTE ALTERADA AQUI 👇 */}
                {stat.change && (
                  <span
                    className={cn(
                      "text-sm",
                      String(stat.change).includes("-")
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => formatLargeNumber(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  formatLargeNumber(value),
                  "Volume",
                ]}
              />
              <Area
                type="monotone"
                dataKey="licitacoes"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
