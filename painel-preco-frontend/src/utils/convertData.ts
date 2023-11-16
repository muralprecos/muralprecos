
import { IItemAutocomplete, IItemSelect, IObjetoAPI } from "@/interfaces/types";

export function listDataToSelectFromProp<T extends IObjetoAPI>(list: T[], prop: keyof T ): IItemSelect[] {
  return list.map(e => ({
    label: e[prop]+'',
    value: e.uuid
  }))
}

export function listDataToSelect<T extends IObjetoAPI>(list: T[] ): IItemSelect[] {
  return list.map(e => ({
    label: e.nome,
    value: e.uuid
  }))
}

export function reqDataListToSelect<T extends IObjetoAPI>(data: T[], prop?: keyof T): IItemSelect[] {
  return !!prop ? listDataToSelectFromProp(data, prop) : listDataToSelect(data);
}