"use client";

import { z } from "zod";
import {
  IItemSelect,
  ISimpleObjetoAPI,
} from "@/interfaces/types";
import { AsyncListData } from "@react-stately/data";
import { Session } from "next-auth";
import ZodStrings from "@/utils/ZodStrings";

export interface IPropsSearchItensLicitacaoForm {
  session: Session | null;
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
}

const optionalString = z.string().nullable().optional();

export const schema = z.object({
  ano: optionalString,
  porteFornecedor: optionalString,
  esferaId: optionalString,
  formaCompraId: optionalString,
  modalidadeCompraId: optionalString,
  
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

  situacao_licitacao: z.string().optional(),
  unidade_fornecimento: optionalString,
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
  [K in keyof Omit<FormDataCotacao, "descricao" | "descricaoComplementar" | "objeto">]: FieldFormTypes;
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