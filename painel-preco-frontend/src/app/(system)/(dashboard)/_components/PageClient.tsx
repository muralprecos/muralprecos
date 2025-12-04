"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import LatestQuotations from "./ultimas-cotacoes";
import LatestTenders from "./ultimas-licitacoes";
import LineChartDashboard from "./LineChart";
import BarChartDashboard from "./BarChart";
import { notify } from "@/components/molecules/NotifyToast";
import { dashboardMock } from "@/lib/mock";
import { StatCards } from "./stats-card";
import type { DashboardResumo } from "@/utils/dashboard";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [resumoData, setResumoData] = useState<DashboardResumo | null>(null);
  const [chartData, setChartData] = useState<
    { mes: string; volumeLicitacoes: number; valorCotacoes: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const handleDashboardData = (data: typeof dashboardMock) => {
      // Setando os dados diretamente no formato que o componente espera
      setResumoData({
        licitacoesMes: data.resumo.licitacoesMes ?? 0,
        licitacoesMesComparacao: data.resumo.licitacoesMesComparacao ?? 0,
        cotacoesCriadas: data.resumo.cotacoesCriadas ?? 0,
        cotacoesCriadasComparacao: data.resumo.cotacoesCriadasComparacao ?? 0,
        valorMedioCotacao: data.resumo.valorMedioCotacao ?? 0,
        valorMedioCotacaoComparacao:
          data.resumo.valorMedioCotacaoComparacao ?? 0,
      });

      setChartData(data.graficos.dadosMensais || []);
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema de cotações"
      />

      <main className="space-y-8">
        <section>
          <StatCards resumo={resumoData} isLoading={loading} />
        </section>

        <LineChartDashboard data={chartData} resumo={resumoData!} />
      </main>
    </div>
  );
}
