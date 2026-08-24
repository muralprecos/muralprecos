"use client";

import { useEffect, useState } from "react";
import {
  IArtefatoGerado,
  IArtefatoSecaoLog,
  IProcessoContratacao,
  TipoArtefatoEnum,
} from "@/interfaces/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormTitle from "@/components/atoms/FormTitle";
import LoadingList from "@/components/atoms/LoadingList";
import { notify } from "@/components/molecules/NotifyToast";
import { catchErrorFromFetch, downloadFile } from "@/utils/requestUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { isClientNextjs } from "@/utils/validateUtils";
import {
  apiClientGetDownloadArtefato,
  apiClientGetLogSecoesArtefato,
  apiClientGetProcessoContratacao,
  apiClientPostGerarArtefato,
  apiClientPostRevisarArtefato,
} from "@/hooks/apiclient";
import { FileText, Loader2, ScrollText } from "lucide-react";

interface IProps {
  uuid: string;
}

const ARTEFATOS: { tipo: TipoArtefatoEnum; titulo: string; descricao: string }[] = [
  { tipo: "ETP", titulo: "Estudo Técnico Preliminar", descricao: "Justifica a necessidade e a solução escolhida." },
  { tipo: "TR", titulo: "Termo de Referência", descricao: "Modelo AGU — condições, requisitos e estimativas." },
  { tipo: "EDITAL", titulo: "Edital", descricao: "Modelo AGU — regras de disputa e habilitação." },
];

function ultimaVersao(artefatos: IArtefatoGerado[], tipo: TipoArtefatoEnum): IArtefatoGerado | null {
  const doTipo = artefatos.filter((a) => a.tipo === tipo);
  if (doTipo.length === 0) return null;
  return doTipo.reduce((maisRecente, atual) => (atual.versao > maisRecente.versao ? atual : maisRecente));
}

export default function ViewProcessoContratacao({ uuid }: IProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [processo, setProcesso] = useState<IProcessoContratacao | null>(null);
  const [gerando, setGerando] = useState<TipoArtefatoEnum | null>(null);
  const [baixando, setBaixando] = useState<TipoArtefatoEnum | null>(null);
  const [revisando, setRevisando] = useState<TipoArtefatoEnum | null>(null);
  const [logAberto, setLogAberto] = useState<{ tipo: TipoArtefatoEnum; versao: number } | null>(null);
  const [logSecoes, setLogSecoes] = useState<IArtefatoSecaoLog[]>([]);
  const [carregandoLog, setCarregandoLog] = useState(false);

  const carregarProcesso = async () => {
    try {
      const req = await apiClientGetProcessoContratacao(uuid);
      setProcesso(req);
    } catch (e) {
      catchErrorFromFetch(e, "carregar o processo de contratação");
    }
  };

  useEffect(() => {
    if (!isClientNextjs()) return;
    (async () => {
      setIsLoading(true);
      await carregarProcesso();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleGerar = async (tipo: TipoArtefatoEnum) => {
    try {
      setGerando(tipo);
      await apiClientPostGerarArtefato(uuid, tipo);
      notify("success", `${tipo} gerado como rascunho. Revise o conteúdo antes de usar.`);
      await carregarProcesso();
    } catch (e: any) {
      notify("error", e?.message || `Erro ao gerar o ${tipo}.`);
    } finally {
      setGerando(null);
    }
  };

  const handleBaixar = async (tipo: TipoArtefatoEnum, versao: number) => {
    try {
      setBaixando(tipo);
      const { blob, filename } = await apiClientGetDownloadArtefato(uuid, tipo, versao);
      downloadFile(blob, filename || `${tipo}-v${versao}.docx`);
      notify("success", "Iniciando download do arquivo!");
    } catch (e: any) {
      notify("error", e?.message || `Erro ao baixar o ${tipo}.`);
    } finally {
      setBaixando(null);
    }
  };

  const handleRevisar = async (tipo: TipoArtefatoEnum, versao: number) => {
    try {
      setRevisando(tipo);
      await apiClientPostRevisarArtefato(uuid, tipo, versao);
      notify("success", `${tipo} marcado como revisado.`);
      await carregarProcesso();
    } catch (e: any) {
      notify("error", e?.message || `Erro ao marcar o ${tipo} como revisado.`);
    } finally {
      setRevisando(null);
    }
  };

  const handleAbrirLog = async (tipo: TipoArtefatoEnum, versao: number) => {
    setLogAberto({ tipo, versao });
    setCarregandoLog(true);
    try {
      const logs = await apiClientGetLogSecoesArtefato(uuid, tipo, versao);
      setLogSecoes(logs);
    } catch (e) {
      catchErrorFromFetch(e, "carregar o log de seções");
    } finally {
      setCarregandoLog(false);
    }
  };

  if (isLoading) {
    return <LoadingList />;
  }

  if (!processo) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Processo de contratação não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormTitle
        icon={<FileText className="h-5 w-5" />}
        title={processo.objeto || "Processo de Contratação"}
        description={`Status: ${processo.status}`}
        uppercase={false}
        backButton={true}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Itens da Cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processo.itens.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.numeroItem}</TableCell>
                  <TableCell className="max-w-md truncate">{item.descricao}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{item.valorUnitario != null ? formatCurrency(item.valorUnitario) : "-"}</TableCell>
                  <TableCell>{item.valorTotal != null ? formatCurrency(item.valorTotal) : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {ARTEFATOS.map(({ tipo, titulo, descricao }) => {
          const artefato = ultimaVersao(processo.artefatos, tipo);
          return (
            <Card key={tipo}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {titulo}
                  {artefato && (
                    <Badge variant={artefato.status === "REVISADO" ? "secondary" : "destructive"}>
                      {artefato.status === "REVISADO" ? "REVISADO" : "MINUTA — REQUER REVISÃO"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{descricao}</p>

                {artefato && (
                  <p className="text-xs text-muted-foreground">
                    Versão {artefato.versao} · gerado em {new Date(artefato.geradoEm).toLocaleString("pt-BR")}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={artefato ? "outline" : "default"}
                    onClick={() => handleGerar(tipo)}
                    disabled={gerando === tipo}
                  >
                    {gerando === tipo ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {artefato ? "Gerar novamente" : "Gerar"}
                  </Button>

                  {artefato && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBaixar(tipo, artefato.versao)}
                        disabled={baixando === tipo}
                      >
                        {baixando === tipo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Baixar .docx
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAbrirLog(tipo, artefato.versao)}
                      >
                        <ScrollText className="mr-1 h-4 w-4" />
                        Log de seções
                      </Button>

                      {artefato.status !== "REVISADO" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRevisar(tipo, artefato.versao)}
                          disabled={revisando === tipo}
                        >
                          {revisando === tipo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Marcar como revisado
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!logAberto} onOpenChange={(open) => !open && setLogAberto(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Log de Seções — {logAberto?.tipo} v{logAberto?.versao}
            </DialogTitle>
          </DialogHeader>
          {carregandoLog ? (
            <LoadingList />
          ) : (
            <div className="space-y-4">
              {logSecoes.map((log, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{log.secaoChave}</span>
                    <Badge variant="outline">{log.origem}</Badge>
                  </div>
                  {log.clausulaSelecionada && (
                    <p className="text-xs text-muted-foreground">
                      Cláusula selecionada: <span className="font-medium">{log.clausulaSelecionada}</span>
                    </p>
                  )}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Fatos enviados à IA</summary>
                    <pre className="mt-1 whitespace-pre-wrap break-words bg-muted p-2 rounded">{log.factsEnviados}</pre>
                  </details>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Resposta da IA</summary>
                    <pre className="mt-1 whitespace-pre-wrap break-words bg-muted p-2 rounded">{log.respostaBruta}</pre>
                  </details>
                </div>
              ))}
              {logSecoes.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma seção registrada.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
