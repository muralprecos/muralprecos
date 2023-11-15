
import { IItemAutocomplete, IObjetoAPI } from "@/interfaces/types";

export function listDataToSelectFromProp<T extends IObjetoAPI>(list: T[], prop: keyof T ): IItemAutocomplete[] {
  return list.map(e => ({
    description: e[prop]+'',
    key: e.uuid
  }))
}

export function listDataToSelect<T extends IObjetoAPI>(list: T[] ): IItemAutocomplete[] {
  return list.map(e => ({
    description: e.nome,
    key: e.uuid
  }))
}

export function reqDataListToSelect<T extends IObjetoAPI>(data: T[], prop?: keyof T): IItemAutocomplete[] {
  return !!prop ? listDataToSelectFromProp(data, prop) : listDataToSelect(data);
}