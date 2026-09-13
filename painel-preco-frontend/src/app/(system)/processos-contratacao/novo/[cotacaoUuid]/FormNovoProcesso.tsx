"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormTitle from "@/components/atoms/FormTitle";
import LoadingList from "@/components/atoms/LoadingList";
import FormWizard, { IWizardStep } from "@/components/molecules/FormWizard";
import { FileText, Loader2 } from "lucide-react";
import { notify } from "@/components/molecules/NotifyToast";
import {
  apiClientGetProcessoContratacaoPorCotacao,
  apiClientPostCreateProcessoContratacao,
} from "@/hooks/apiclient";
import { catchErrorFromFetch } from "@/utils/requestUtils";
import { isClientNextjs } from "@/utils/validateUtils";
import { IProcessoContratacaoForm } from "@/interfaces/types";

interface IProps {
  cotacaoUuid: string;
}

const ESTADO_INICIAL: IProcessoContratacaoForm = {
  cotacaoUuid: "",
  objeto: "",
  justificativaNecessidade: "",
  modalidadePretendida: null,
  criterioJulgamento: null,
  regimeExecucao: null,
  prazoVigenciaMeses: null,
  prazoVigenciaFundamentoLegal: null,
  tipoObjetoContinuo: false,
  orcamentoSigiloso: false,
  registroPrecos: false,
  tratamentoFavorecidoMeEpp: true,
  dotacaoGestaoUnidade: "",
  dotacaoFonteRecursos: "",
  dotacaoProgramaTrabalho: "",
  dotacaoElementoDespesa: "",
  dotacaoPlanoInterno: "",
  dotacaoPostergada: false,
  orgaoNome: "",
  orgaoCnpj: "",
  orgaoEndereco: "",
  orgaoEsfera: "",
  orgaoUasg: "",
  orgaoTelefone: "",
  localExecucaoServicos: "",
  horarioExecucaoServicos: "",
  prazoInicioExecucaoDias: null,
  marcoInicioExecucao: null,
  prazoRecebimentoProvisorioDias: null,
  prazoRecebimentoDefinitivoDias: null,
  prazoPagamentoDias: null,
  exigeGarantiaContratual: false,
  percentualGarantiaContratual: null,
  garantiaServicoDescricao: "",
  permiteSubcontratacao: false,
  percentualMaximoSubcontratacao: null,
  exigeUniforme: false,
  especificacaoUniforme: "",
  indiceReajuste: "",
  periodicidadeReajusteMeses: null,
  percentualMultaMoratoria: null,
  percentualMultaCompensatoria: null,
  prazoAssinaturaContratoDiasUteis: null,
  prazoValidadePropostaDias: null,
  intervaloMinimoLances: "",
  meioImpugnacaoEsclarecimento: "",
};

export default function FormNovoProcesso({ cotacaoUuid }: IProps) {
  const router = useRouter();
  const [form, setForm] = useState<IProcessoContratacaoForm>({
    ...ESTADO_INICIAL,
    cotacaoUuid,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [verificandoExistente, setVerificandoExistente] = useState(true);

  useEffect(() => {
    if (!isClientNextjs()) return;
    (async () => {
      try {
        const existente = await apiClientGetProcessoContratacaoPorCotacao(cotacaoUuid);
        if (existente) {
          router.replace(`/processos-contratacao/${existente.uuid}`);
          return;
        }
      } catch (e) {
        catchErrorFromFetch(e, "verificar processos já existentes para esta cotação");
      }
      setVerificandoExistente(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotacaoUuid]);

  const set = <K extends keyof IProcessoContratacaoForm>(
    campo: K,
    valor: IProcessoContratacaoForm[K]
  ) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const processo = await apiClientPostCreateProcessoContratacao(form);
      notify("success", "Processo de contratação criado! Agora gere os artefatos.");
      router.push(`/processos-contratacao/${processo.uuid}`);
    } catch (err: any) {
      notify("error", err?.message || "Erro ao criar o processo de contratação.");
    } finally {
      setIsSaving(false);
    }
  };

  if (verificandoExistente) {
    return <LoadingList />;
  }

  const stepDadosGerais = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="objeto">Objeto da contratação</Label>
              <Textarea
                id="objeto"
                value={form.objeto ?? ""}
                onChange={(e) => set("objeto", e.target.value)}
                placeholder="Ex.: aquisição de materiais de limpeza e higiene para os prédios administrativos do órgão"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="justificativa">Justificativa da necessidade</Label>
              <Textarea
                id="justificativa"
                value={form.justificativaNecessidade ?? ""}
                onChange={(e) => set("justificativaNecessidade", e.target.value)}
                placeholder="Por que esta contratação é necessária?"
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepModalidade = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modalidade, Julgamento e Execução</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Modalidade pretendida</Label>
              <Select
                value={form.modalidadePretendida ?? undefined}
                onValueChange={(v) => set("modalidadePretendida", v as IProcessoContratacaoForm["modalidadePretendida"])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREGAO">Pregão Eletrônico</SelectItem>
                  <SelectItem value="CONCORRENCIA">Concorrência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Critério de julgamento</Label>
              <Select
                value={form.criterioJulgamento ?? undefined}
                onValueChange={(v) => set("criterioJulgamento", v as IProcessoContratacaoForm["criterioJulgamento"])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MENOR_PRECO">Menor preço</SelectItem>
                  <SelectItem value="MAIOR_DESCONTO">Maior desconto</SelectItem>
                  <SelectItem value="TECNICA_E_PRECO">Técnica e preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Regime de execução</Label>
              <Select
                value={form.regimeExecucao ?? undefined}
                onValueChange={(v) => set("regimeExecucao", v as IProcessoContratacaoForm["regimeExecucao"])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="COM_DEDICACAO_MAO_DE_OBRA">Serviço com dedicação de mão de obra</SelectItem>
                  <SelectItem value="SEM_DEDICACAO_MAO_DE_OBRA">Serviço sem dedicação de mão de obra</SelectItem>
                  <SelectItem value="COMPRAS">Compras</SelectItem>
                  <SelectItem value="OBRAS">Obras</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="objetoContinuo" className="cursor-pointer">Objeto de natureza continuada</Label>
              <Switch
                id="objetoContinuo"
                checked={!!form.tipoObjetoContinuo}
                onCheckedChange={(v) => set("tipoObjetoContinuo", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="registroPrecos" className="cursor-pointer">Registro de preços</Label>
              <Switch
                id="registroPrecos"
                checked={!!form.registroPrecos}
                onCheckedChange={(v) => set("registroPrecos", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="orcamentoSigiloso" className="cursor-pointer">Orçamento sigiloso</Label>
              <Switch
                id="orcamentoSigiloso"
                checked={!!form.orcamentoSigiloso}
                onCheckedChange={(v) => set("orcamentoSigiloso", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="tratamentoMeEpp" className="cursor-pointer">Tratamento favorecido ME/EPP</Label>
              <Switch
                id="tratamentoMeEpp"
                checked={!!form.tratamentoFavorecidoMeEpp}
                onCheckedChange={(v) => set("tratamentoFavorecidoMeEpp", v)}
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepVigencia = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vigência e Reajuste</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prazoVigencia">Prazo de vigência (meses)</Label>
              <Input
                id="prazoVigencia"
                type="number"
                min={1}
                value={form.prazoVigenciaMeses ?? ""}
                onChange={(e) => set("prazoVigenciaMeses", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fundamento legal da vigência</Label>
              <Select
                value={form.prazoVigenciaFundamentoLegal ?? undefined}
                onValueChange={(v) => set("prazoVigenciaFundamentoLegal", v as IProcessoContratacaoForm["prazoVigenciaFundamentoLegal"])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ART_105">Art. 105 (prazo determinado)</SelectItem>
                  <SelectItem value="ART_106_107">Arts. 106-107 (serviço contínuo, prorrogável)</SelectItem>
                  <SelectItem value="ART_75_VIII">Art. 75, VIII (improrrogável)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="indiceReajuste">Índice de reajuste</Label>
              <Input
                id="indiceReajuste"
                value={form.indiceReajuste ?? ""}
                onChange={(e) => set("indiceReajuste", e.target.value)}
                placeholder="Ex.: IPCA, IGP-M"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="periodicidadeReajuste">Periodicidade do reajuste (meses)</Label>
              <Input
                id="periodicidadeReajuste"
                type="number"
                min={1}
                value={form.periodicidadeReajusteMeses ?? ""}
                onChange={(e) => set("periodicidadeReajusteMeses", e.target.value ? Number(e.target.value) : null)}
                placeholder="Geralmente 12"
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepExecucao = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Execução, Local e Prazos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="localExecucao">Local de execução dos serviços</Label>
              <Input id="localExecucao" value={form.localExecucaoServicos ?? ""} onChange={(e) => set("localExecucaoServicos", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horarioExecucao">Horário de execução dos serviços</Label>
              <Input id="horarioExecucao" value={form.horarioExecucaoServicos ?? ""} onChange={(e) => set("horarioExecucaoServicos", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Marco de início da execução</Label>
              <Select
                value={form.marcoInicioExecucao ?? undefined}
                onValueChange={(v) => set("marcoInicioExecucao", v as IProcessoContratacaoForm["marcoInicioExecucao"])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSINATURA_CONTRATO">Assinatura do contrato</SelectItem>
                  <SelectItem value="ORDEM_SERVICO">Emissão da ordem de serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoInicioExecucao">Prazo para início da execução (dias)</Label>
              <Input
                id="prazoInicioExecucao"
                type="number"
                min={0}
                value={form.prazoInicioExecucaoDias ?? ""}
                onChange={(e) => set("prazoInicioExecucaoDias", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoRecebimentoProvisorio">Prazo de recebimento provisório (dias)</Label>
              <Input
                id="prazoRecebimentoProvisorio"
                type="number"
                min={0}
                value={form.prazoRecebimentoProvisorioDias ?? ""}
                onChange={(e) => set("prazoRecebimentoProvisorioDias", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoRecebimentoDefinitivo">Prazo de recebimento definitivo (dias)</Label>
              <Input
                id="prazoRecebimentoDefinitivo"
                type="number"
                min={0}
                value={form.prazoRecebimentoDefinitivoDias ?? ""}
                onChange={(e) => set("prazoRecebimentoDefinitivoDias", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoPagamento">Prazo de pagamento (dias)</Label>
              <Input
                id="prazoPagamento"
                type="number"
                min={0}
                value={form.prazoPagamentoDias ?? ""}
                onChange={(e) => set("prazoPagamentoDias", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepGarantias = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Garantias e Subcontratação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="exigeGarantia" className="cursor-pointer">Exige garantia contratual</Label>
              <Switch
                id="exigeGarantia"
                checked={!!form.exigeGarantiaContratual}
                onCheckedChange={(v) => set("exigeGarantiaContratual", v)}
              />
            </div>
            {form.exigeGarantiaContratual && (
              <div className="space-y-1.5">
                <Label htmlFor="percentualGarantia">Percentual de garantia contratual (%)</Label>
                <Input
                  id="percentualGarantia"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.percentualGarantiaContratual ?? ""}
                  onChange={(e) => set("percentualGarantiaContratual", e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            )}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="garantiaServico">Garantia do serviço/produto</Label>
              <Input
                id="garantiaServico"
                value={form.garantiaServicoDescricao ?? ""}
                onChange={(e) => set("garantiaServicoDescricao", e.target.value)}
                placeholder="Ex.: 12 meses contra defeitos de fabricação"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="permiteSubcontratacao" className="cursor-pointer">Permite subcontratação</Label>
              <Switch
                id="permiteSubcontratacao"
                checked={!!form.permiteSubcontratacao}
                onCheckedChange={(v) => set("permiteSubcontratacao", v)}
              />
            </div>
            {form.permiteSubcontratacao && (
              <div className="space-y-1.5">
                <Label htmlFor="percentualSubcontratacao">Percentual máximo de subcontratação (%)</Label>
                <Input
                  id="percentualSubcontratacao"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.percentualMaximoSubcontratacao ?? ""}
                  onChange={(e) => set("percentualMaximoSubcontratacao", e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            )}

            {form.regimeExecucao === "COM_DEDICACAO_MAO_DE_OBRA" && (
              <>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="exigeUniforme" className="cursor-pointer">Exige uniforme</Label>
                  <Switch
                    id="exigeUniforme"
                    checked={!!form.exigeUniforme}
                    onCheckedChange={(v) => set("exigeUniforme", v)}
                  />
                </div>
                {form.exigeUniforme && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="especificacaoUniforme">Especificação do uniforme</Label>
                    <Input
                      id="especificacaoUniforme"
                      value={form.especificacaoUniforme ?? ""}
                      onChange={(e) => set("especificacaoUniforme", e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
  );

  const stepSancoes = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sanções e Formalização</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="multaMoratoria">Multa moratória (%)</Label>
              <Input
                id="multaMoratoria"
                type="number"
                min={0}
                step="0.01"
                value={form.percentualMultaMoratoria ?? ""}
                onChange={(e) => set("percentualMultaMoratoria", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="multaCompensatoria">Multa compensatória (%)</Label>
              <Input
                id="multaCompensatoria"
                type="number"
                min={0}
                step="0.01"
                value={form.percentualMultaCompensatoria ?? ""}
                onChange={(e) => set("percentualMultaCompensatoria", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoAssinatura">Prazo para assinar o contrato (dias úteis)</Label>
              <Input
                id="prazoAssinatura"
                type="number"
                min={0}
                value={form.prazoAssinaturaContratoDiasUteis ?? ""}
                onChange={(e) => set("prazoAssinaturaContratoDiasUteis", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoValidadeProposta">Prazo de validade da proposta (dias)</Label>
              <Input
                id="prazoValidadeProposta"
                type="number"
                min={0}
                value={form.prazoValidadePropostaDias ?? ""}
                onChange={(e) => set("prazoValidadePropostaDias", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intervaloLances">Intervalo mínimo entre lances</Label>
              <Input
                id="intervaloLances"
                value={form.intervaloMinimoLances ?? ""}
                onChange={(e) => set("intervaloMinimoLances", e.target.value)}
                placeholder="Ex.: R$ 0,01 ou 0,5%"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meioImpugnacao">Meio de impugnação/esclarecimento</Label>
              <Input
                id="meioImpugnacao"
                value={form.meioImpugnacaoEsclarecimento ?? ""}
                onChange={(e) => set("meioImpugnacaoEsclarecimento", e.target.value)}
                placeholder="Ex.: e-mail licitacao@orgao.gov.br"
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepDotacao = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dotação Orçamentária</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="gestaoUnidade">Gestão/Unidade</Label>
              <Input id="gestaoUnidade" value={form.dotacaoGestaoUnidade ?? ""} onChange={(e) => set("dotacaoGestaoUnidade", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fonteRecursos">Fonte de recursos</Label>
              <Input id="fonteRecursos" value={form.dotacaoFonteRecursos ?? ""} onChange={(e) => set("dotacaoFonteRecursos", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="programaTrabalho">Programa de trabalho</Label>
              <Input id="programaTrabalho" value={form.dotacaoProgramaTrabalho ?? ""} onChange={(e) => set("dotacaoProgramaTrabalho", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="elementoDespesa">Elemento de despesa</Label>
              <Input id="elementoDespesa" value={form.dotacaoElementoDespesa ?? ""} onChange={(e) => set("dotacaoElementoDespesa", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="planoInterno">Plano interno</Label>
              <Input id="planoInterno" value={form.dotacaoPlanoInterno ?? ""} onChange={(e) => set("dotacaoPlanoInterno", e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="dotacaoPostergada" className="cursor-pointer">Postergar indicação da dotação</Label>
              <Switch
                id="dotacaoPostergada"
                checked={!!form.dotacaoPostergada}
                onCheckedChange={(v) => set("dotacaoPostergada", v)}
              />
            </div>
          </CardContent>
        </Card>
  );

  const stepOrgao = (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do Órgão Requisitante</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="orgaoNome">Nome do órgão</Label>
              <Input id="orgaoNome" value={form.orgaoNome ?? ""} onChange={(e) => set("orgaoNome", e.target.value)} placeholder="Preenchido automaticamente, se não informado" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgaoCnpj">CNPJ</Label>
              <Input id="orgaoCnpj" value={form.orgaoCnpj ?? ""} onChange={(e) => set("orgaoCnpj", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgaoUasg">UASG</Label>
              <Input id="orgaoUasg" value={form.orgaoUasg ?? ""} onChange={(e) => set("orgaoUasg", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="orgaoEndereco">Endereço</Label>
              <Input id="orgaoEndereco" value={form.orgaoEndereco ?? ""} onChange={(e) => set("orgaoEndereco", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgaoEsfera">Esfera</Label>
              <Input id="orgaoEsfera" value={form.orgaoEsfera ?? ""} onChange={(e) => set("orgaoEsfera", e.target.value)} placeholder="Federal, Estadual, Municipal..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgaoTelefone">Telefone</Label>
              <Input id="orgaoTelefone" value={form.orgaoTelefone ?? ""} onChange={(e) => set("orgaoTelefone", e.target.value)} />
            </div>
          </CardContent>
        </Card>
  );

  const steps: IWizardStep[] = [
    { titulo: "Dados Gerais", conteudo: stepDadosGerais },
    { titulo: "Modalidade e Execução", conteudo: stepModalidade },
    { titulo: "Vigência e Reajuste", conteudo: stepVigencia },
    { titulo: "Execução, Local e Prazos", conteudo: stepExecucao },
    { titulo: "Garantias e Subcontratação", conteudo: stepGarantias },
    { titulo: "Sanções e Formalização", conteudo: stepSancoes },
    { titulo: "Dotação Orçamentária", conteudo: stepDotacao },
    { titulo: "Dados do Órgão", conteudo: stepOrgao },
  ];

  return (
    <div className="space-y-6">
      <FormTitle
        icon={<FileText className="h-5 w-5" />}
        title="Novo Processo de Contratação"
        description="Preencha os dados institucionais e legais para gerar o ETP, o Termo de Referência e o Edital."
        uppercase={false}
        backButton={true}
      />

      <form onSubmit={handleSubmit}>
        <FormWizard steps={steps}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando processo...
              </>
            ) : (
              "Criar Processo e Continuar"
            )}
          </Button>
        </FormWizard>
      </form>
    </div>
  );
}
