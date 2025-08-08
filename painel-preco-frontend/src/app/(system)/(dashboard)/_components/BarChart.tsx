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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, FileText, DollarSign } from "lucide-react";
import type { RecentData } from "./dashboard";

export default function BarChartDashboard() {
  const [kpiData, setKpiData] = useState({
    totalTenders: { value: 0, change: 0, loading: true },
    totalQuotations: { value: 0, change: 0, loading: true },
    avgQuotationValue: { value: 0, change: 0, loading: true },
    totalSuppliers: { value: 0, change: 0, loading: true },
  });

  type MonthlyTender = { month: string; tenders: number };
  type MonthlyQuotation = { month: string; value: number };

  const [recentData, setRecentData] = useState<RecentData>({
    latestTenders: [],
    latestQuotations: [],
    mostPurchasedItems: [],
  });

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

      // Mock KPI data
      setKpiData({
        totalTenders: { value: 847, change: 12.5, loading: false },
        totalQuotations: { value: 2847, change: 8.3, loading: false },
        avgQuotationValue: { value: 15420.5, change: -2.1, loading: false },
        totalSuppliers: { value: 567, change: 15.2, loading: false },
      });

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
        monthlyQuotations: [
          { month: "Jan", value: 125000 },
          { month: "Fev", value: 145000 },
          { month: "Mar", value: 165000 },
          { month: "Abr", value: 155000 },
          { month: "Mai", value: 185000 },
          { month: "Jun", value: 205000 },
        ],
      });

      // Mock recent data
      setRecentData({
        latestTenders: [
          {
            id: "LIC001",
            number: "2025/001",
            object: "Aquisição de material de limpeza",
            unit: "Secretaria de Administração",
            value: "R$ 45.680,00",
            openingDate: "28/06/2025",
            status: "Aberta",
          },
          {
            id: "LIC002",
            number: "2025/002",
            object: "Contratação de serviços de manutenção",
            unit: "Secretaria de Obras",
            value: "R$ 125.340,00",
            openingDate: "27/06/2025",
            status: "Em andamento",
          },
          {
            id: "LIC003",
            number: "2025/003",
            object: "Fornecimento de equipamentos de informática",
            unit: "Secretaria de Tecnologia",
            value: "R$ 89.750,00",
            openingDate: "26/06/2025",
            status: "Finalizada",
          },
        ],
        latestQuotations: [
          {
            id: "9b95c045ab9b3714bc8d599a7e2d4ebc",
            totalValue: "R$ 568,33",
            date: "27/06/2025",
            status: "Concluída",
          },
          {
            id: "7a84b123cd4e5678ef9g012h3i4j5k6l",
            totalValue: "R$ 1.245,67",
            date: "26/06/2025",
            status: "Pendente",
          },
          {
            id: "8c95d156bc7a4829de0f123g4h5i6j7k",
            totalValue: "R$ 3.456,89",
            date: "25/06/2025",
            status: "Em análise",
          },
        ],
        mostPurchasedItems: [
          {
            description: "Água mineral natural 500ml",
            quantity: 15420,
            totalValue: "R$ 23.130,00",
            unit: "Unidade",
          },
          {
            description: "Papel A4 75g/m² 500 folhas",
            quantity: 8950,
            totalValue: "R$ 17.900,00",
            unit: "Resma",
          },
          {
            description: "Caneta esferográfica azul",
            quantity: 12300,
            totalValue: "R$ 9.840,00",
            unit: "Unidade",
          },
        ],
      });
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: "Licitações Este Mês",
      value: kpiData.totalTenders.loading
        ? "..."
        : kpiData.totalTenders.value.toLocaleString(),
      icon: FileText,
      change: kpiData.totalTenders.change,
      subtitle: "este mês",
      loading: kpiData.totalTenders.loading,
    },
    {
      name: "Cotações Criadas",
      value: kpiData.totalQuotations.loading
        ? "..."
        : kpiData.totalQuotations.value.toLocaleString(),
      icon: BarChart3,
      change: kpiData.totalQuotations.change,
      subtitle: "total",
      loading: kpiData.totalQuotations.loading,
    },
    {
      name: "Valor Médio Cotação",
      value: kpiData.avgQuotationValue.loading
        ? "..."
        : `R$ ${kpiData.avgQuotationValue.value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`,
      icon: DollarSign,
      change: kpiData.avgQuotationValue.change,
      subtitle: "média geral",
      loading: kpiData.avgQuotationValue.loading,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
            <BarChart data={chartData.monthlyQuotations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar
                dataKey="value"
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
