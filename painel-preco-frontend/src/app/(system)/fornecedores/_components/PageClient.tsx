"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import { KpiCards } from "./KpiCards";
import { RankingTable } from "./RankingTable";
import { PorteChart } from "./PorteChart";
import { EvolucaoChart } from "./EvolucaoChart";
import { FiltrosFornecedores } from "./FiltrosFornecedores";
import { useFornecedoresQueryStates, filtrosToParams, type FornecedoresFiltros } from "../_lib/fornecedoresQuery";
import { notifyApiError } from "@/utils/errorUtils";
import type { FornecedorKpi, FornecedorRankingItem, FornecedorPorteItem, FornecedorEvolucaoItem } from "./types";

async function apiFetch<T>(recurso: string, params?: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ recurso, ...params }).toString();
  const res = await fetch(`/api/dashboard/fornecedores?${qs}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const error = new Error(errorBody?.message || `HTTP ${res.status}`);
    (error as any).status = res.status;
    (error as any).details = errorBody;
    throw error;
  }
  return res.json();
}

export default function FornecedoresDashboardClient() {
  const [queryState, setQueryState] = useFornecedoresQueryStates();
  const filtros: FornecedoresFiltros = queryState;
  const filtroParams = filtrosToParams(filtros);
  const filtroParamsKey = JSON.stringify(filtroParams);

  const [kpi, setKpi] = useState<FornecedorKpi | null>(null);
  const [ranking, setRanking] = useState<FornecedorRankingItem[]>([]);
  const [porte, setPorte] = useState<FornecedorPorteItem[]>([]);
  const [evolucao, setEvolucao] = useState<FornecedorEvolucaoItem[]>([]);
  const [ano, setAno] = useState(new Date().getFullYear());

  const [loadKpi, setLoadKpi] = useState(true);
  const [loadRanking, setLoadRanking] = useState(true);
  const [loadPorte, setLoadPorte] = useState(true);
  const [loadEvolucao, setLoadEvolucao] = useState(true);

  const handleError = (error: unknown) => {
    console.error(error);
    notifyApiError(error, "Erro ao carregar dados de fornecedores", {
      id: "fornecedores-dashboard-error",
    });
  };

  useEffect(() => {
    setLoadKpi(true);
    apiFetch<FornecedorKpi>("kpis", filtroParams)
      .then(setKpi)
      .catch(handleError)
      .finally(() => setLoadKpi(false));

    setLoadRanking(true);
    apiFetch<FornecedorRankingItem[]>("ranking", { limite: "10", ...filtroParams })
      .then(setRanking)
      .catch(handleError)
      .finally(() => setLoadRanking(false));

    setLoadPorte(true);
    apiFetch<FornecedorPorteItem[]>("por-porte", filtroParams)
      .then(setPorte)
      .catch(handleError)
      .finally(() => setLoadPorte(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParamsKey]);

  const fetchEvolucao = useCallback((a: number) => {
    setLoadEvolucao(true);
    apiFetch<FornecedorEvolucaoItem[]>("evolucao-mensal", { ano: String(a), ...filtroParams })
      .then(setEvolucao)
      .catch(handleError)
      .finally(() => setLoadEvolucao(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParamsKey]);

  useEffect(() => { fetchEvolucao(ano); }, [ano, fetchEvolucao]);

  return (
    <div>
      <PageHeader
        title="Dashboard de Fornecedores"
        subtitle="Análise de fornecedores homologados em licitações"
      />

      <main className="space-y-6">
        <FiltrosFornecedores filtros={filtros} onAplicar={(f) => setQueryState(f)} />

        <KpiCards kpi={kpi} isLoading={loadKpi} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RankingTable items={ranking} isLoading={loadRanking} />
          </div>
          <div>
            <PorteChart items={porte} isLoading={loadPorte} />
          </div>
        </div>

        <EvolucaoChart
          items={evolucao}
          ano={ano}
          onAnoChange={setAno}
          isLoading={loadEvolucao}
        />
      </main>
    </div>
  );
}
