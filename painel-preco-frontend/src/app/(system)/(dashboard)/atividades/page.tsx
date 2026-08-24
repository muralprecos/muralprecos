"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import { notify } from "@/components/molecules/NotifyToast";
import { dashboardMock } from "@/lib/mock";
import type { DashboardData, Licitacao, Cotacao } from "@/utils/dashboard";
import { RecentActivities } from "../_components/atividade-recetes";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [resumoData, setResumoData] = useState<DashboardData["resumo"] | null>(
    null
  );
  const [recentLicitacoes, setRecentLicitacoes] = useState<Licitacao[]>([]);
  const [recentCotacoes, setRecentCotacoes] = useState<Cotacao[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");

        const data: DashboardData = await res.json();
        handleDashboardData(data);
      } catch (error) {
        console.warn("API falhou, usando dados mockados.");
        handleDashboardData(dashboardMock as DashboardData);

        notify(
          "warning",
          "Usando dados mockados",
          "A API não respondeu. Exibindo dados ilustrativos locais.",
          { id: "dashboard-mock-warning" }
        );
      } finally {
        setLoading(false);
      }
    };

    const handleDashboardData = (data: DashboardData) => {
      setResumoData(data.resumo);

      setRecentLicitacoes(data.ultimasLicitacoes.content);
      setRecentCotacoes(data.ultimasCotacoes.content);
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Atividade"
        subtitle="Acompanhe as licitações e cotações recentes."
      />

      <main className="space-y-8">
        <RecentActivities
          licitacoes={recentLicitacoes}
          cotacoes={recentCotacoes}
        />
      </main>
    </div>
  );
}
