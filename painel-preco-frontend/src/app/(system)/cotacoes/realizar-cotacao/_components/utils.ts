"use client";

import * as yup from "yup";
import yupStrings from "@/utils/yupStrings";
import {
  IItemSelect,
  ISimpleObjetoAPI,
} from "@/interfaces/types";
import { AsyncListData } from "@react-stately/data";
import { Session } from "next-auth";

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

export const schema = yup.object({
  ano: yup.string().nullable(),
  porteFornecedor: yup.string().nullable(),
  esferaId: yup.string().nullable(),
  formaCompraId: yup.string().nullable(),
  modalidadeCompraId: yup.string().nullable(),
  periodoCompraId: yup.string().required(yupStrings.required),

  ufId: yup.string().nullable(),
  municipioId: yup.string().nullable(),
  orgaoSuperiorId: yup.string().nullable(),
  orgaoId: yup.string().nullable(),
  fornecedorId: yup.string().nullable(),
  materialId: yup.string().nullable(),
  ugId: yup.string().nullable(),
  objeto: yup.string().nullable(),
  descricao: yup.string().nullable(),
  descricaoComplementar: yup.string().nullable(),

  situacao_licitacao: yup.string(),
  unidade_fornecimento: yup.string().nullable(),
});
export type FormDataCotacao = yup.InferType<typeof schema>;
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
  [K in keyof FormDataCotacao]: FieldFormTypes;
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