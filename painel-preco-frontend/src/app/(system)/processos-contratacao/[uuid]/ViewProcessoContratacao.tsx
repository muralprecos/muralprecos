"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  IArtefatoGerado,
  IArtefatoSecaoLog,
  IProcessoContratacao,
  StatusProcessoContratacaoEnum,
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
  apiClientGetDownloadArtefatoFinal,
  apiClientGetLogSecoesArtefato,
  apiClientGetProcessoContratacao,
  apiClientPostGerarArtefato,
  apiClientPostRevisarArtefato,
  apiClientPostUploadArtefatoFinal,
} from "@/hooks/apiclient";
import { FileText, Loader2, ScrollText, Upload } from "lucide-react";

interface IProps {
  uuid: string;
}

const STATUS_PROCESSO_LABEL: Record<StatusProcessoContratacaoEnum, string> = {
  INTAKE: "Aguardando dados do processo",
  EM_GERACAO: "Gerando artefatos",
  RASCUNHO_DISPONIVEL: "Rascunho disponível para revisão",
  CONCLUIDO: "Concluído",
};

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
  const [gerando, setGerando] = useState<Set<TipoArtefatoEnum>>(new Set());
  const [baixando, setBaixando] = useState<Set<TipoArtefatoEnum>>(new Set());
  const [baixandoFinal, setBaixandoFinal] = useState<Set<TipoArtefatoEnum>>(new Set());
  const [enviandoFinal, setEnviandoFinal] = useState<Set<TipoArtefatoEnum>>(new Set());
  const [revisando, setRevisando] = useState<Set<TipoArtefatoEnum>>(new Set());
  const inputsArquivoFinal = useRef<Partial<Record<TipoArtefatoEnum, HTMLInputElement | null>>>({});

  const marcar = (setter: Dispatch<SetStateAction<Set<TipoArtefatoEnum>>>, tipo: TipoArtefatoEnum, ativo: boolean) =>
    setter((atual) => {
      const proximo = new Set(atual);
      if (ativo) proximo.add(tipo);
      else proximo.delete(tipo);
      return proximo;
    });
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
      marcar(setGerando, tipo, true);
      await apiClientPostGerarArtefato(uuid, tipo);
      notify("success", `${tipo} gerado como rascunho. Revise o conteúdo antes de usar.`);
      await carregarProcesso();
    } catch (e: any) {
      notify("error", e?.message || `Erro ao gerar o ${tipo}.`);
    } finally {
      marcar(setGerando, tipo, false);
    }
  };

  const handleBaixar = async (tipo: TipoArtefatoEnum, versao: number) => {
    try {
      marcar(setBaixando, tipo, true);
      const { blob, filename } = await apiClientGetDownloadArtefato(uuid, tipo, versao);
      downloadFile(blob, filename || `${tipo}-v${versao}.docx`);
      notify("success", "Iniciando download do arquivo!");
    } catch (e: any) {
      notify("error", e?.message || `Erro ao baixar o ${tipo}.`);
    } finally {
      marcar(setBaixando, tipo, false);
    }
  };

  const handleBaixarFinal = async (tipo: TipoArtefatoEnum, versao: number) => {
    try {
      marcar(setBaixandoFinal, tipo, true);
      const { blob, filename } = await apiClientGetDownloadArtefatoFinal(uuid, tipo, versao);
      downloadFile(blob, filename || `${tipo}-final-v${versao}.docx`);
      notify("success", "Iniciando download do arquivo!");
    } catch (e: any) {
      notify("error", e?.message || `Erro ao baixar a versão final do ${tipo}.`);
    } finally {
      marcar(setBaixandoFinal, tipo, false);
    }
  };

  const handleEnviarFinal = async (tipo: TipoArtefatoEnum, versao: number, e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    try {
      marcar(setEnviandoFinal, tipo, true);
      await apiClientPostUploadArtefatoFinal(uuid, tipo, versao, arquivo);
      notify("success", `Versão final do ${tipo} enviada e marcada como revisada.`);
      await carregarProcesso();
    } catch (e: any) {
      notify("error", e?.message || `Erro ao enviar a versão final do ${tipo}.`);
    } finally {
      marcar(setEnviandoFinal, tipo, false);
    }
  };

  const handleRevisar = async (tipo: TipoArtefatoEnum, versao: number) => {
    try {
      marcar(setRevisando, tipo, true);
      await apiClientPostRevisarArtefato(uuid, tipo, versao);
      notify("success", `${tipo} marcado como revisado.`);
      await carregarProcesso();
    } catch (e: any) {
      notify("error", e?.message || `Erro ao marcar o ${tipo} como revisado.`);
    } finally {
      marcar(setRevisando, tipo, false);
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
        description={`Status: ${STATUS_PROCESSO_LABEL[processo.status] ?? processo.status}`}
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 min-w-0 rounded-lg border p-3 space-y-2">
                      <p className="text-xs font-medium">Gerado pelo sistema</p>
                      <p className="text-xs text-muted-foreground">
                        Versão {artefato.versao} · {new Date(artefato.geradoEm).toLocaleString("pt-BR")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBaixar(tipo, artefato.versao)}
                          disabled={baixando.has(tipo)}
                        >
                          {baixando.has(tipo) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 rounded-lg border p-3 space-y-2">
                      <p className="text-xs font-medium">Versão final</p>
                      {artefato.nomeArquivoFinal ? (
                        <p className="text-xs text-muted-foreground truncate" title={artefato.nomeArquivoFinal}>
                          {artefato.nomeArquivoFinal}
                          {artefato.finalEnviadoEm && ` · ${new Date(artefato.finalEnviadoEm).toLocaleString("pt-BR")}`}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Nenhuma versão final enviada ainda.</p>
                      )}
                      <div className="flex flex-col gap-2">
                        {artefato.nomeArquivoFinal && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-center"
                            onClick={() => handleBaixarFinal(tipo, artefato.versao)}
                            disabled={baixandoFinal.has(tipo)}
                          >
                            {baixandoFinal.has(tipo) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Baixar .docx
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full justify-center"
                          onClick={() => inputsArquivoFinal.current[tipo]?.click()}
                          disabled={enviandoFinal.has(tipo)}
                        >
                          {enviandoFinal.has(tipo) ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                          ) : (
                            <Upload className="mr-1 h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">{artefato.nomeArquivoFinal ? "Substituir arquivo" : "Enviar arquivo"}</span>
                        </Button>
                        <input
                          type="file"
                          accept=".docx"
                          hidden
                          ref={(el) => {
                            inputsArquivoFinal.current[tipo] = el;
                          }}
                          onChange={(e) => handleEnviarFinal(tipo, artefato.versao, e)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={artefato ? "outline" : "default"}
                    onClick={() => handleGerar(tipo)}
                    disabled={gerando.has(tipo)}
                  >
                    {gerando.has(tipo) ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {artefato ? "Gerar novamente" : "Gerar"}
                  </Button>

                  {artefato && (
                    <>
                      {artefato.status !== "REVISADO" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRevisar(tipo, artefato.versao)}
                          disabled={revisando.has(tipo)}
                        >
                          {revisando.has(tipo) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
