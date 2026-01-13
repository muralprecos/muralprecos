"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

type MonthlyQuotation = {
  mes: string;
  valorCotacoes: number;
};

export default function BarChartDashboard({
  data,
}: {
  data: MonthlyQuotation[];
}) {
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `R$ ${(value / 1_000_000_000_000).toFixed(1)}T`;
    }
    if (value >= 1_000_000_000) {
      return `R$ ${(value / 1_000_000_000).toFixed(0)}B`;
    }
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(0)}M`;
    }
    if (value >= 1_000) {
      return `R$ ${(value / 1_000).toFixed(0)}k`;
    }
    return `R$ ${value}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Valor Mensal de Cotações
        </CardTitle>
        <CardDescription>Valor total das cotações por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="mes" />
              <YAxis
                width={90}
                tickFormatter={formatYAxis}
                domain={[0, "auto"]}
              />

              <Bar
                dataKey="valorCotacoes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
