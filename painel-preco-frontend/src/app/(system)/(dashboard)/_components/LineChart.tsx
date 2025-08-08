"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Eye } from "lucide-react";

export default function LineChartDashboard() {
  type MonthlyTender = { month: string; tenders: number };
  type MonthlyQuotation = { month: string; value: number };

  type ChartData = {
    monthlyTenders: MonthlyTender[];
    monthlyQuotations: MonthlyQuotation[];
  };

  const [chartData, setChartData] = useState<ChartData>({
    monthlyTenders: [],
    monthlyQuotations: [],
  });

  // Simulate API calls - replace with actual API endpoints
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock chart data
      setChartData({
        monthlyTenders: [
          { month: "Jan", tenders: 65 },
          { month: "Fev", tenders: 78 },
          { month: "Mar", tenders: 92 },
          { month: "Abr", tenders: 85 },
          { month: "Mai", tenders: 103 },
          { month: "Jun", tenders: 125 },
        ],
        monthlyQuotations: [],
      });
    };

    fetchDashboardData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Volume Mensal de Licitações
        </CardTitle>
        <CardDescription>Número de licitações abertas por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.monthlyTenders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tenders"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
