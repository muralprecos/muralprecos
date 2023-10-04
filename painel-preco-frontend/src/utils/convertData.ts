
import { IItemAutocomplete, IObjetoAPI, IReturnRequestAPI } from "@/interfaces/types";

export function listDataToAutocompleteFromProp<T extends IObjetoAPI>(list: T[], prop: keyof T ): IItemAutocomplete[] {
  return list.map(e => ({
    description: e[prop]+'',
    key: e.uuid
  }))
}

export function listDataToAutocomplete<T extends IObjetoAPI>(list: T[] ): IItemAutocomplete[] {
  return list.map(e => ({
    description: e.nome,
    key: e.uuid
  }))
}

export function reqDataPageableToAutocomplete<T extends IObjetoAPI>(data: IReturnRequestAPI<T>, prop?: keyof T): IItemAutocomplete[] {
  return !!prop ? listDataToAutocompleteFromProp(data.content, prop) : listDataToAutocomplete(data.content);
}
export function reqDataListToAutocomplete<T extends IObjetoAPI>(data: T[], prop?: keyof T): IItemAutocomplete[] {
  return !!prop ? listDataToAutocompleteFromProp(data, prop) : listDataToAutocomplete(data);
}