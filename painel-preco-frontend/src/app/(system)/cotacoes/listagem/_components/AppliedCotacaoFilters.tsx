"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLabelCache } from "@/hooks/useLabelCache";
import type { IItemSelect } from "@/interfaces/types";
import type { CotacaoQueryState } from "@/app/(system)/cotacoes/realizar-cotacao/_components/buildBackendParams";
import { SORT_OPTIONS } from "@/app/(system)/cotacoes/realizar-cotacao/_components/utils";

type SelectFilterOptions = {
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
};

type AppliedCotacaoFiltersProps = {
  queryState: CotacaoQueryState;
  options: SelectFilterOptions;
  onRemoveFilter: (key: keyof CotacaoQueryState) => void;
  onClearAll: () => void;
  onEditFilters: () => void;
  isEditing: boolean;
};

const FILTER_LABELS: Partial<Record<keyof CotacaoQueryState, string>> = {
  descricao: "Descricao",
  periodoCompraId: "Periodo",
  ano: "Ano",
  ufId: "UF",
  municipioId: "Municipio",
  ugId: "UG",
  unidadeFornecimentoId: "Unidade Fornecimento",
  porteFornecedorId: "Porte Empresa",
  esferaId: "Esfera",
  formaCompraId: "Modo Disputa",
  modalidadeId: "Modalidade",
  situacaoId: "Situacao",
  orgaoSuperiorId: "Orgao Superior",
  orgaoId: "Orgao",
  fornecedorId: "Fornecedor",
  materialId: "Material",
  objeto: "Objeto",
  descricaoComplementar: "Descricao Complementar",
  sort: "Ordenacao",
};

const hiddenFilters: Array<keyof CotacaoQueryState> = ["page", "size", "dir"];

export default function AppliedCotacaoFilters({
  queryState,
  options,
  onRemoveFilter,
  onClearAll,
  onEditFilters,
  isEditing,
}: AppliedCotacaoFiltersProps) {
  const { getLabel } = useLabelCache();

  const staticLookup = useMemo(() => {
    const map = new Map<string, string>();
    const register = (field: string, values: IItemSelect[]) => {
      values.forEach((item) => map.set(`${field}:${item.value}`, item.label));
    };

    register("periodoCompraId", options.compraPeriodos);
    register("ano", options.anosCompras);
    register("ufId", options.unidadesFederativas);
    register("porteFornecedorId", options.empresaPorte);
    register("esferaId", options.esferas);
    register("formaCompraId", options.compraFormas);
    register("modalidadeId", options.compraModalidades);
    register("situacaoId", options.situacoesLicitacoes);
    register("sort", SORT_OPTIONS);

    return map;
  }, [options]);

  const filters = useMemo(() => {
    return (Object.keys(queryState) as Array<keyof CotacaoQueryState>)
      .filter((key) => !hiddenFilters.includes(key))
      .map((key) => {
        const rawValue = queryState[key];
        if (rawValue == null) return null;
        const text = String(rawValue).trim();
        if (!text || text === "0") return null;

        const cached = getLabel(key, text);
        const fromLookup = staticLookup.get(`${key}:${text}`);
        const valueLabel = cached ?? fromLookup ?? text;
        const keyLabel = FILTER_LABELS[key] ?? key;
        return {
          key,
          keyLabel,
          value: text,
          valueLabel,
          display: `${keyLabel}: ${valueLabel}`,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null);
  }, [getLabel, queryState, staticLookup]);

  if (!filters.length) {
    return (
      <div className="rounded-md border border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          Nenhum filtro aplicado no momento.
        </p>
        <Button className="mt-3" variant="outline" size="sm" onClick={onEditFilters}>
          {isEditing ? "Fechar edição" : "Editar filtros"}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">Filtros aplicados</h3>
        <Button size="sm" variant="outline" onClick={onEditFilters}>
          {isEditing ? "Fechar edição" : "Editar filtros"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Badge
            key={`${item.key}-${item.value}`}
            variant="secondary"
            className="flex gap-2 items-center pr-1"
          >
            <span>{item.display}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs"
              onClick={() => onRemoveFilter(item.key)}
            >
              x
            </Button>
          </Badge>
        ))}
      </div>

    </div>
  );
}
