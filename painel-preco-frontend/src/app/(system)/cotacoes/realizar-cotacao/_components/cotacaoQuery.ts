import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import type { CotacaoQueryState, SortDir } from "./buildBackendParams";
import { FormDataCotacao, TipoBuscaDescricao } from "./utils";

export const cotacaoQueryParsers = {
  descricao: parseAsString,
  tipoBuscaDescricao: parseAsString,
  periodoCompraId: parseAsString,
  ano: parseAsString,
  regiao: parseAsString,
  ufId: parseAsString,
  municipioId: parseAsString,
  ugId: parseAsString,
  unidadeFornecimentoId: parseAsString,
  porteFornecedorId: parseAsString,
  esferaId: parseAsString,
  formaCompraId: parseAsString,
  modalidadeId: parseAsString,
  situacaoId: parseAsString,
  orgaoId: parseAsString,
  orgaoSuperiorId: parseAsString,
  fornecedorId: parseAsString,
  materialId: parseAsString,
  objeto: parseAsString,
  descricaoComplementar: parseAsString,
  page: parseAsInteger,
  size: parseAsInteger,
  sort: parseAsString,
  dir: parseAsStringLiteral(["asc", "desc"] as const),
};

export const useCotacaoQueryStates = () => useQueryStates(cotacaoQueryParsers);

export const defaultFormValues: FormDataCotacao = {
  ano: "",
  porteFornecedorId: "",
  esferaId: "",
  formaCompraId: "",
  modalidadeId: "",
  periodoCompraId: "",
  descricao: "",
  tipoBuscaDescricao: TipoBuscaDescricao.TODAS_PALAVRAS,
  regiao: "",
  ufId: "",
  municipioId: "",
  orgaoSuperiorId: "",
  orgaoId: "",
  fornecedorId: "",
  materialId: "",
  ugId: "",
  objeto: "",
  descricaoComplementar: "",
  situacaoId: "",
  unidadeFornecimentoId: "",
};

const cleanString = (value: string | null | undefined) => {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed.length) return null;
  if (trimmed === "0") return null;
  return trimmed;
};

export const queryToFormValues = (query: CotacaoQueryState): FormDataCotacao => {
  return {
    ano: query.ano ?? "",
    porteFornecedorId: query.porteFornecedorId ?? "",
    esferaId: query.esferaId ?? "",
    formaCompraId: query.formaCompraId ?? "",
    modalidadeId: query.modalidadeId ?? "",
    periodoCompraId: query.periodoCompraId ?? "",
    descricao: query.descricao ?? "",
    tipoBuscaDescricao: (query.tipoBuscaDescricao as TipoBuscaDescricao) ?? TipoBuscaDescricao.TODAS_PALAVRAS,
    regiao: query.regiao ?? "",
    ufId: query.ufId ?? "",
    municipioId: query.municipioId ?? "",
    orgaoSuperiorId: query.orgaoSuperiorId ?? "",
    orgaoId: query.orgaoId ?? "",
    fornecedorId: query.fornecedorId ?? "",
    materialId: query.materialId ?? "",
    ugId: query.ugId ?? "",
    objeto: query.objeto ?? "",
    descricaoComplementar: query.descricaoComplementar ?? "",
    situacaoId: query.situacaoId ?? "",
    unidadeFornecimentoId: query.unidadeFornecimentoId ?? "",
  };
};

export const formValuesToQuery = (values: FormDataCotacao): CotacaoQueryState => {
  return {
    ano: cleanString(values.ano),
    porteFornecedorId: cleanString(values.porteFornecedorId),
    esferaId: cleanString(values.esferaId),
    formaCompraId: cleanString(values.formaCompraId),
    modalidadeId: cleanString(values.modalidadeId),
    periodoCompraId: cleanString(values.periodoCompraId),
    descricao: cleanString(values.descricao),
    tipoBuscaDescricao: cleanString(values.tipoBuscaDescricao),
    regiao: cleanString(values.regiao),
    ufId: cleanString(values.ufId),
    municipioId: cleanString(values.municipioId),
    orgaoSuperiorId: cleanString(values.orgaoSuperiorId),
    orgaoId: cleanString(values.orgaoId),
    fornecedorId: cleanString(values.fornecedorId),
    materialId: cleanString(values.materialId),
    ugId: cleanString(values.ugId),
    objeto: cleanString(values.objeto),
    descricaoComplementar: cleanString(values.descricaoComplementar),
    situacaoId: cleanString(values.situacaoId),
    unidadeFornecimentoId: cleanString(values.unidadeFornecimentoId),
  };
};

export const isSortDir = (value: string | null | undefined): value is SortDir => {
  return value === "asc" || value === "desc";
};
