"use client";
import { Download, CheckCircle2, XCircle, RefreshCw, PlusCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SincronizacaoResultado } from "@/interfaces/gestao";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultado: SincronizacaoResultado | null;
  executadoEm: string | null;
}

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

export function SincronizacaoResultadoModal({ open, onOpenChange, resultado, executadoEm }: Props) {
  if (!resultado) return null;

  const handleDownload = () => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Resultado da Sincronização
          </DialogTitle>
          {executadoEm && (
            <p className="text-sm text-muted-foreground">
              Executada em: {new Date(executadoEm).toLocaleString("pt-BR")}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-5">
          {/* Usuários */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Usuários
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Detalhamento ({resultado.mensagens.length} evento{resultado.mensagens.length !== 1 ? "s" : ""})
                </h3>
                <ScrollArea className="h-48 rounded-md border bg-muted/30 p-3">
                  <ul className="space-y-1">
                    {resultado.mensagens.map((msg, i) => (
                      <li key={i} className="text-sm flex gap-2 items-start">
                        <span className="mt-0.5 text-muted-foreground select-none">•</span>
                        <span>{msg}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </>
          )}

          {resultado.mensagens.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhuma alteração foi necessária.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Baixar JSON
          </Button>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
