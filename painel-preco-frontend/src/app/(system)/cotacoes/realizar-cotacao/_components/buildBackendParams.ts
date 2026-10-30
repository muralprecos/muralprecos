import type { ReadonlyURLSearchParams } from "next/navigation";

export type SortDir = "asc" | "desc";

export type CotacaoQueryState = {
  descricao?: string | null;
  tipoBuscaDescricao?: string | null;
  periodoCompraId?: string | null;
  ano?: string | null;
  regiao?: string | null;
  ufId?: string | null;
  municipioId?: string | null;
  ugId?: string | null;
  unidadeFornecimentoId?: string | null;
  porteFornecedorId?: string | null;
  esferaId?: string | null;
  formaCompraId?: string | null;
  modalidadeId?: string | null;
  situacaoId?: string | null;
  orgaoId?: string | null;
  orgaoSuperiorId?: string | null;
  fornecedorId?: string | null;
  materialId?: string | null;
  objeto?: string | null;
  descricaoComplementar?: string | null;
  page?: number | null;
  size?: number | null;
  sort?: string | null;
  dir?: SortDir | null;
};



// Contract: page/size are 0-based in URL and backend, so zero is valid.
const ALLOW_ZERO_FIELDS = new Set(["page", "size"]);

const normalizeValue = (key: string, value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") {
    if (value === 0 && !ALLOW_ZERO_FIELDS.has(key)) return undefined;
    return String(value);
  }
  const str = String(value).trim();
  if (str === "") return undefined;
  if (str === "0" && !ALLOW_ZERO_FIELDS.has(key)) return undefined;
  return str;
};

const normalizeDir = (value: unknown): SortDir | undefined => {
  const dir = normalizeValue("dir", value);
  if (dir === "asc" || dir === "desc") return dir;
  return undefined;
};

export const buildBackendParams = (state: CotacaoQueryState): URLSearchParams => {
  const params = new URLSearchParams();
  const normalized: Record<string, string> = {};

  Object.entries(state).forEach(([key, value]) => {
    if (key === "sort" || key === "dir") return;
    const normalizedValue = normalizeValue(key, value);
    if (normalizedValue === undefined) return;
    normalized[key] = normalizedValue;
  });

  const sort = normalizeValue("sort", state.sort);
  const dir = normalizeDir(state.dir);
  if (sort) {
    normalized.sort = dir ? `${sort},${dir}` : sort;
  }

  Object.keys(normalized)
    .sort()
    .forEach((key) => {
      params.set(key, normalized[key]);
    });

  return params;
};

export const stableSerializeState = (state: CotacaoQueryState): string => {
  const normalizedEntries = Object.entries(state)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (value === null) return [key, null] as const;
      if (typeof value === "number") return [key, value] as const;
      return [key, String(value)] as const;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return JSON.stringify(Object.fromEntries(normalizedEntries));
};


