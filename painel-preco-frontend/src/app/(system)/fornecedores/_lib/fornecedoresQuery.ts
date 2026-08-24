import { parseAsString, useQueryStates } from "nuqs";

export const fornecedoresQueryParsers = {
  dataInicio: parseAsString,
  dataFim: parseAsString,
  nome: parseAsString,
  documento: parseAsString,
  porte: parseAsString,
};

export const useFornecedoresQueryStates = () => useQueryStates(fornecedoresQueryParsers);

export type FornecedoresFiltros = {
  dataInicio: string | null;
  dataFim: string | null;
  nome: string | null;
  documento: string | null;
  porte: string | null;
};

/** Converte o estado de filtro em params para as chamadas de API, descartando vazios. */
export function filtrosToParams(filtros: FornecedoresFiltros): Record<string, string> {
  const params: Record<string, string> = {};
  if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) params.dataFim = filtros.dataFim;
  if (filtros.nome) params.nome = filtros.nome;
  if (filtros.documento) params.documento = filtros.documento;
  if (filtros.porte) params.porte = filtros.porte;
  return params;
}
