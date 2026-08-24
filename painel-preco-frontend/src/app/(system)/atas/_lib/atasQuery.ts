import { parseAsString, useQueryStates } from "nuqs";

export const atasQueryParsers = {
  dataInicio: parseAsString,
  dataFim: parseAsString,
  situacao: parseAsString,
  objeto: parseAsString,
};

export const useAtasQueryStates = () => useQueryStates(atasQueryParsers);

export type AtasFiltros = {
  dataInicio: string | null;
  dataFim: string | null;
  situacao: string | null;
  objeto: string | null;
};

/** Converte o estado de filtro em params para as chamadas de API, descartando vazios. */
export function filtrosToParams(filtros: AtasFiltros): Record<string, string> {
  const params: Record<string, string> = {};
  if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) params.dataFim = filtros.dataFim;
  if (filtros.situacao) params.situacao = filtros.situacao;
  if (filtros.objeto) params.objeto = filtros.objeto;
  return params;
}
