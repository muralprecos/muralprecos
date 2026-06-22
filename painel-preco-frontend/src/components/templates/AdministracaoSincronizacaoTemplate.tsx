"use client";
import { useState } from "react";
import { RefreshCw, Download, CheckCircle2, XCircle, PlusCircle, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SincronizacaoResultado } from "@/interfaces/gestao";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "success" | "danger" | "warning" | "neutral";
}

const variantClasses: Record<StatCardProps["variant"], string> = {
  success: "bg-green-50 text-green-800 border-green-200",
  danger: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  neutral: "bg-muted text-muted-foreground border-border",
};

function StatCard({ label, value, icon, variant }: StatCardProps) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${variantClasses[variant]}`}>
      <span className="shrink-0">{icon}</span>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs mt-1 leading-snug">{label}</p>
      </div>
    </div>
  );
}

async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    const raw: string = body?.message ?? body?.error ?? fallback;
    const match = raw.match(/ArchException:\s*(.+)$/);
    return match ? match[1].trim() : raw;
  } catch {
    return fallback;
  }
}

export function AdministracaoSincronizacaoTemplate() {
  const [sincronizando, setSincronizando] = useState(false);
  const [resultado, setResultado] = useState<SincronizacaoResultado | null>(null);
  const [executadoEm, setExecutadoEm] = useState<string | null>(null);
  const [isSimulacao, setIsSimulacao] = useState(false);

  const handleSimular = async () => {
    setSincronizando(true);
    try {
      const agora = new Date().toISOString();
      const res = await fetch("/api/sincronizacao/simular");
      if (!res.ok) throw new Error(await parseApiError(res, "Erro ao simular sincronização"));
      const data: SincronizacaoResultado = await res.json();
      setResultado(data);
      setExecutadoEm(agora);
      setIsSimulacao(true);
      toast.success("Simulação concluída. Revise os dados antes de confirmar.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na simulação");
    } finally {
      setSincronizando(false);
    }
  };

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      const agora = new Date().toISOString();
      const res = await fetch("/api/sincronizacao", { method: "POST" });
      if (!res.ok) throw new Error(await parseApiError(res, "Erro ao sincronizar"));
      const data: SincronizacaoResultado = await res.json();
      setResultado(data);
      setExecutadoEm(agora);
      setIsSimulacao(false);
      toast.success("Sincronização concluída com sucesso.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na sincronização");
    } finally {
      setSincronizando(false);
    }
  };

  const handleDownload = () => {
    if (!resultado) return;
    const payload = { executadoEm, ...resultado };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sincronizacao-${(executadoEm ?? new Date().toISOString()).replace(/[:.]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const iconSize = "h-5 w-5";

  return (
    <main>
      <PageHeader
        title="Sincronização com Keycloak"
        subtitle="Gerencie e sincronize usuários e organizações a partir do servidor de identidade"
      />

      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle>Como funciona a sincronização?</CardTitle>
          <CardDescription>
            O processo de sincronização conecta-se ao Keycloak, varrendo todos os usuários e grupos
            (que são mapeados para as organizações no Painel). 
            <br className="mb-2" />
            Ao clicar em <strong>Simular</strong>, você poderá prever exatamente quais usuários serão criados, 
            reativados ou desativados localmente para espelhar as configurações lá existentes, garantindo assim 
            que o banco local fique perfeitamente alinhado com as permissões mais recentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSimular}
            disabled={sincronizando}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${sincronizando ? "animate-spin" : ""}`} />
            {sincronizando ? "Processando..." : "Simular Sincronização"}
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="border-primary/20">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  {isSimulacao ? "Prévia da Sincronização" : "Resultado da Sincronização"}
                </CardTitle>
                {executadoEm && (
                  <CardDescription className="mt-1">
                    Executada em: {new Date(executadoEm).toLocaleString("pt-BR")}
                  </CardDescription>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Baixar JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Usuários */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Usuários
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <StatCard label="Criados" value={resultado.usuariosCriados} icon={<PlusCircle className={iconSize} />} variant="success" />
                <StatCard label="Desativados" value={resultado.usuariosDesativados} icon={<XCircle className={iconSize} />} variant="danger" />
                <StatCard label="Reativados" value={resultado.usuariosReativados} icon={<CheckCircle2 className={iconSize} />} variant="neutral" />
                <StatCard label="Conflitos" value={resultado.usuariosComConflito} icon={<AlertTriangle className={iconSize} />} variant="warning" />
                <StatCard label="Não alterados" value={resultado.usuariosNaoAlterados} icon={<CheckCircle2 className={iconSize} />} variant="neutral" />
              </div>
            </div>

            <Separator />

            {/* Organizações */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Organizações
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <StatCard label="Criadas" value={resultado.organizacoesCriadas} icon={<PlusCircle className={iconSize} />} variant="success" />
                <StatCard label="Desativadas" value={resultado.organizacoesDesativadas} icon={<XCircle className={iconSize} />} variant="danger" />
                <StatCard label="Reativadas" value={resultado.organizacoesReativadas} icon={<CheckCircle2 className={iconSize} />} variant="neutral" />
                <StatCard label="Conflitos" value={resultado.organizacoesComConflito} icon={<AlertTriangle className={iconSize} />} variant="warning" />
                <StatCard label="Não alteradas" value={resultado.organizacoesNaoAlteradas} icon={<CheckCircle2 className={iconSize} />} variant="neutral" />
              </div>
            </div>

            {/* Detalhamento */}
            {resultado.mensagens.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Detalhamento ({resultado.mensagens.length} evento{resultado.mensagens.length !== 1 ? "s" : ""})
                  </h3>
                  <ScrollArea className="h-64 rounded-md border bg-muted/30 p-4">
                    <ul className="space-y-2">
                      {resultado.mensagens.map((msg, i) => (
                        <li key={i} className="text-sm flex gap-3 items-start text-foreground/80">
                          <span className="mt-1 flex-shrink-0 text-muted-foreground select-none">•</span>
                          <span>{msg}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </>
            )}

            {resultado.mensagens.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma alteração necessária. A base de dados local já está espelhada com o Keycloak.
              </p>
            )}

            {/* Botão de confirmação apenas na simulação */}
            {isSimulacao && (
              <>
                <Separator />
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    onClick={handleSincronizar}
                    disabled={sincronizando}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Confirmar e Sincronizar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
