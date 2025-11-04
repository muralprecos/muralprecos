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
import { dashboardMock } from "@/lib/mock";

export default function DashboardLayout() {
  const [kpiData, setKpiData] = useState({
    totalTenders: { value: 0, change: 0, loading: true },
    totalQuotations: { value: 0, change: 0, loading: true },
    avgQuotationValue: { value: 0, change: 0, loading: true },
    totalSuppliers: { value: 0, change: 0, loading: true },
  });

  const [chartData, setChartData] = useState<
    { mes: string; volumeLicitacoes: number; valorCotacoes: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");

        const data = await res.json();
        handleDashboardData(data);
      } catch (error) {
        console.warn("API falhou, usando dados mockados.");
        handleDashboardData(dashboardMock);

        notify(
          "warning",
          "Usando dados mockados",
          "A API não respondeu. Exibindo dados ilustrativos locais."
        );
      }
    };

    const handleDashboardData = (data: typeof dashboardMock) => {
      const resumo = data.resumo;

      setKpiData({
        totalTenders: {
          value: resumo.licitacoesMes ?? 0,
          change: resumo.licitacoesMesComparacao ?? 0,
          loading: false,
        },
        totalQuotations: {
          value: resumo.cotacoesCriadas ?? 0,
          change: isNaN(parseFloat(resumo.cotacoesCriadasComparacao))
            ? 0
            : parseFloat(resumo.cotacoesCriadasComparacao),
          loading: false,
        },
        avgQuotationValue: {
          value: resumo.valorMedioCotacao ?? 0,
          change: resumo.valorMedioCotacaoComparacao ?? 0,
          loading: false,
        },
        totalSuppliers: { value: 0, change: 0, loading: false },
      });

      setChartData(data.graficos.dadosMensais || []);
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema de cotações (Dados meramente ilustrativos)"
      />

      <main className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
          {stats.map((stat) => (
            <KPICard key={stat.name} {...stat} />
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChartDashboard data={chartData} />
          <BarChartDashboard data={chartData} />
        </div>

        {/* Listagens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LatestTenders data={dashboardMock.ultimasLicitacoes.content} />
          <LatestQuotations data={dashboardMock.ultimasCotacoes.content} />
        </div>
      </main>
    </div>
  );
}
