"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, FileText, Gavel, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ColetaPncpStatus {
  licitacoesItensEmAndamento: boolean;
  fornecedoresEmAndamento: boolean;
  atasEmAndamento: boolean;
}

const STATUS_VAZIO: ColetaPncpStatus = {
  licitacoesItensEmAndamento: false,
  fornecedoresEmAndamento: false,
  atasEmAndamento: false,
};

interface EtapaConfig {
  chave: keyof ColetaPncpStatus;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  path: string;
}

const ETAPAS: EtapaConfig[] = [
  {
    chave: "fornecedoresEmAndamento",
    titulo: "Fornecedores",
    descricao:
      "Resolve o fornecedor vencedor dos itens já baixados que ainda não têm resultado associado.",
    icon: <Building2 className="h-5 w-5" />,
    path: "/api/coleta-pncp/fornecedores",
  },
  {
    chave: "atasEmAndamento",
    titulo: "Atas de registro de preço",
    descricao: "Ingere as atas de registro de preço para licitações do tipo SRP ainda pendentes.",
    icon: <FileText className="h-5 w-5" />,
    path: "/api/coleta-pncp/atas",
  },
  {
    chave: "licitacoesItensEmAndamento",
    titulo: "Licitações e itens",
    descricao:
      "Baixa novas licitações e itens do PNCP e ingere o que já estiver em disco. Pode levar várias horas.",
    icon: <Gavel className="h-5 w-5" />,
    path: "/api/coleta-pncp/licitacoes-itens",
  },
];

export function AdministracaoColetaPncpTemplate() {
  const [status, setStatus] = useState<ColetaPncpStatus>(STATUS_VAZIO);
  const [disparando, setDisparando] = useState<Record<string, boolean>>({});
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buscarStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/coleta-pncp/status", { cache: "no-store" });
      if (!res.ok) return;
      const data: ColetaPncpStatus = await res.json();
      setStatus(data);
    } catch {
      // silencioso: próximo polling tenta de novo
    }
  }, []);

  useEffect(() => {
    buscarStatus();
    pollRef.current = setInterval(buscarStatus, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [buscarStatus]);

  const emAndamento = (chave: keyof ColetaPncpStatus) => status[chave];

  const dispararEtapa = async (etapa: EtapaConfig) => {
    setDisparando((prev) => ({ ...prev, [etapa.chave]: true }));
    try {
      const res = await fetch(etapa.path, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Erro ao disparar a coleta");
      }
      setStatus(data);
      toast.success(`Coleta de ${etapa.titulo.toLowerCase()} iniciada em segundo plano.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao disparar a coleta");
    } finally {
      setDisparando((prev) => ({ ...prev, [etapa.chave]: false }));
      buscarStatus();
    }
  };

  return (
    <main>
      <PageHeader
        title="Coleta de dados do PNCP"
        subtitle="Dispare manualmente as etapas de coleta e ingestão de dados do Portal Nacional de Contratações Públicas"
      />

      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
          <CardDescription>
            Cada etapa roda em segundo plano assim que disparada — a tela não fica travada esperando.
            O mesmo agendamento diário usa essas etapas, então uma etapa já em execução (seja pelo
            agendamento, seja por outro disparo manual) é ignorada até terminar, evitando
            processamento duplicado.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {ETAPAS.map((etapa) => {
          const rodando = emAndamento(etapa.chave);
          const carregando = disparando[etapa.chave];
          return (
            <Card key={etapa.chave}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {etapa.icon}
                    {etapa.titulo}
                  </CardTitle>
                  {rodando && (
                    <Badge variant="secondary" className="gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Em execução
                    </Badge>
                  )}
                </div>
                <CardDescription>{etapa.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => dispararEtapa(etapa)}
                  disabled={rodando || carregando}
                  className="w-full gap-2"
                >
                  {carregando ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    etapa.icon
                  )}
                  {rodando ? "Em execução..." : "Disparar coleta"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
