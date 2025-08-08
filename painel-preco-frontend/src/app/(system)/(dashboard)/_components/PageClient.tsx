"use client";

import { useState, useEffect } from "react";

import { BarChart3, FileText, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";
import { KPICard } from "./KPICard";
import LatestQuotations from "./LatestQuotations";
import LatestTenders from "./LatestTenders";
import LineChartDashboard from "./LineChart";
import BarChartDashboard from "./BarChart";
import { notify } from "@/components/molecules/NotifyToast";

export default function DashboardLayout() {
  const [kpiData, setKpiData] = useState({
    totalTenders: { value: 0, change: 0, loading: true },
    totalQuotations: { value: 0, change: 0, loading: true },
    avgQuotationValue: { value: 0, change: 0, loading: true },
    totalSuppliers: { value: 0, change: 0, loading: true },
  });

  // Simulate API calls
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
    };

    notify(
      "info",
      "Dados meramente ilustrativos",
      "Esses dados são fictícios e não refletem informações reais."
    );

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

  return (
    <div className="">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema de cotações (Dados meramente ilustrativos)"
      />

      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
          {stats.map((stat) => (
            <KPICard
              key={stat.name}
              name={stat.name}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              subtitle={stat.subtitle}
              loading={stat.loading}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChartDashboard />
          <BarChartDashboard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LatestTenders />
          <LatestQuotations />
        </div>
      </main>
    </div>
  );
}
