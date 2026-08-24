"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import { KpiCards } from "./KpiCards";
import { SituacaoChart } from "./SituacaoChart";
import { EvolucaoChart } from "./EvolucaoChart";
import { AlertasVencimento } from "./AlertasVencimento";
import { TopObjetosTable } from "./TopObjetosTable";
import { FiltrosAtas } from "./FiltrosAtas";
import { useAtasQueryStates, filtrosToParams, type AtasFiltros } from "../_lib/atasQuery";
import { notifyApiError } from "@/utils/errorUtils";
import type {
  AtaKpi,
  AtaSituacaoItem,
  AtaEvolucaoItem,
  AtaTopObjetoItem,
  AtaAlertaVencimento,
} from "./types";

async function apiFetch<T>(recurso: string, params?: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ recurso, ...params }).toString();
  const res = await fetch(`/api/dashboard/atas?${qs}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const error = new Error(errorBody?.message || `HTTP ${res.status}`);
    (error as any).status = res.status;
    (error as any).details = errorBody;
    throw error;
  }
  return res.json();
}

export default function AtasDashboardClient() {
  const [queryState, setQueryState] = useAtasQueryStates();
  const filtros: AtasFiltros = queryState;
  const filtroParams = filtrosToParams(filtros);

  const [kpi, setKpi] = useState<AtaKpi | null>(null);
  const [situacao, setSituacao] = useState<AtaSituacaoItem[]>([]);
  const [evolucao, setEvolucao] = useState<AtaEvolucaoItem[]>([]);
  const [topObjetos, setTopObjetos] = useState<AtaTopObjetoItem[]>([]);
  const [alertas, setAlertas] = useState<AtaAlertaVencimento[]>([]);
  const [ano, setAno] = useState(new Date().getFullYear() - 1); // default 2025

  const [loadKpi, setLoadKpi] = useState(true);
  const [loadSituacao, setLoadSituacao] = useState(true);
  const [loadEvolucao, setLoadEvolucao] = useState(true);
  const [loadTopObjetos, setLoadTopObjetos] = useState(true);
  const [loadAlertas, setLoadAlertas] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtroParamsKey = JSON.stringify(filtroParams);

  const handleError = (error: unknown) => {
    console.error(error);
    notifyApiError(error, "Erro ao carregar dados de atas", {
      id: "atas-dashboard-error",
    });
  };

  useEffect(() => {
    setLoadKpi(true);
    apiFetch<AtaKpi>("kpis", filtroParams)
      .then(setKpi)
      .catch(handleError)
      .finally(() => setLoadKpi(false));

    setLoadSituacao(true);
    apiFetch<AtaSituacaoItem[]>("por-situacao", filtroParams)
      .then(setSituacao)
      .catch(handleError)
      .finally(() => setLoadSituacao(false));

    setLoadTopObjetos(true);
    apiFetch<AtaTopObjetoItem[]>("top-objetos", { limite: "10", ...filtroParams })
      .then(setTopObjetos)
      .catch(handleError)
      .finally(() => setLoadTopObjetos(false));

    setLoadAlertas(true);
    apiFetch<AtaAlertaVencimento[]>("alertas-vencimento", filtroParams)
      .then(setAlertas)
      .catch(handleError)
      .finally(() => setLoadAlertas(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParamsKey]);

  const fetchEvolucao = useCallback((a: number) => {
    setLoadEvolucao(true);
    apiFetch<AtaEvolucaoItem[]>("evolucao-mensal", { ano: String(a), ...filtroParams })
      .then(setEvolucao)
      .catch(handleError)
      .finally(() => setLoadEvolucao(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParamsKey]);

  useEffect(() => { fetchEvolucao(ano); }, [ano, fetchEvolucao]);

  return (
    <div>
      <PageHeader
        title="Atas de Registro de Preço"
        subtitle="Monitoramento de atas vigentes, alertas de vencimento e cobertura por objeto"
      />

      <main className="space-y-6">
        <FiltrosAtas filtros={filtros} onAplicar={(f) => setQueryState(f)} />

        <KpiCards kpi={kpi} isLoading={loadKpi} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EvolucaoChart
              items={evolucao}
              ano={ano}
              onAnoChange={setAno}
              isLoading={loadEvolucao}
            />
          </div>
          <div>
            <SituacaoChart items={situacao} isLoading={loadSituacao} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertasVencimento items={alertas} isLoading={loadAlertas} />
          <TopObjetosTable items={topObjetos} isLoading={loadTopObjetos} />
        </div>
      </main>
    </div>
  );
}
