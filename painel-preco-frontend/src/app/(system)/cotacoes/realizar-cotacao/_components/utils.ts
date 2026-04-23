"use client";

import { z } from "zod";
import {
  IItemSelect,
  ISimpleObjetoAPI,
} from "@/interfaces/types";

export const SORT_OPTIONS: IItemSelect[] = [
  { value: "", label: "Relevância (padrão)" },
  { value: "valorUnitario,asc", label: "Valor Unitário (menor primeiro)" },
  { value: "valorUnitario,desc", label: "Valor Unitário (maior primeiro)" },
  // { value: "valor,asc", label: "Valor Total (menor primeiro)" },
  // { value: "valor,desc", label: "Valor Total (maior primeiro)" },
  { value: "quantidade,asc", label: "Quantidade (menor primeiro)" },
  { value: "quantidade,desc", label: "Quantidade (maior primeiro)" },
  { value: "dataResultadoCompra,desc", label: "Data Compra (mais recente)" },
  { value: "dataResultadoCompra,asc", label: "Data Compra (mais antiga)" },
  // { value: "dataAbertura,desc", label: "Data Abertura (mais recente)" },
  // { value: "dataAbertura,asc", label: "Data Abertura (mais antiga)" },
  { value: "descricao,asc", label: "Descrição (A-Z)" },
  { value: "descricao,desc", label: "Descrição (Z-A)" },
];
import { AsyncListData } from "@react-stately/data";
import { ClientSession } from "@/interfaces/auth";
import ZodStrings from "@/utils/ZodStrings";

export interface IPropsSearchItensLicitacaoForm {
  session: ClientSession | null;
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
  variant?: "page" | "inline";
  onAfterSubmit?: () => void;
}

const optionalString = z.string().nullable().optional();

export const schema = z.object({
  ano: optionalString,
  porteFornecedorId: optionalString,
  esferaId: optionalString,
  formaCompraId: optionalString,
  modalidadeId: optionalString,
  
  periodoCompraId: z.string().min(1, ZodStrings.required || "Campo obrigatório"),

  descricao: z.string().min(1, ZodStrings.required || "Campo obrigatório"), 

  ufId: optionalString,
  municipioId: optionalString,
  orgaoSuperiorId: optionalString,
  orgaoId: optionalString,
  fornecedorId: optionalString,
  materialId: optionalString,
  ugId: optionalString,
  objeto: optionalString,
  
  descricaoComplementar: optionalString,


  situacaoId: optionalString,
  unidadeFornecimentoId: optionalString,

  sort: optionalString,
});

export type FormDataCotacao = z.infer<typeof schema>;

export type FieldAutocompleteAsync<T extends ISimpleObjetoAPI> = {
  async: AsyncListData<T>;
  attrVal: "uuid" | "nome";
  isDisabled?: boolean;
  apiFindDesc?: (uuid: string) => Promise<string | null>;
};
export type FieldFormSelect = {
  type: "select";
  label: string;
  items: IItemSelect[];
};
export type FieldFormAutocompleteStatic = {
  type: "autocompletStatic";
  label: string;
  items: IItemSelect[];
};
export type FieldFormAutocompleteAsync = {
  type: "autocompleteAsync";
  label: string;
  auto: FieldAutocompleteAsync<any>;
};
export type FieldFormTypes =
  | FieldFormSelect
  | FieldFormAutocompleteStatic
  | FieldFormAutocompleteAsync;
export type FieldsForms = {
  [K in keyof Omit<FormDataCotacao, "descricao" | "descricaoComplementar" | "objeto" | "sort">]: FieldFormTypes;
};

export function isFieldSelect(obj: FieldFormTypes | undefined): obj is FieldFormSelect {
  return !!obj && obj.type === "select";
}

export function isFieldAutocompleteStatic(obj: FieldFormTypes | undefined): obj is FieldFormAutocompleteStatic {
  return !!obj && obj.type === "autocompletStatic";
}

export function isFieldAutocompleteAsync(obj: FieldFormTypes | undefined): obj is FieldFormAutocompleteAsync {
  return !!obj && obj.type === "autocompleteAsync";
}
