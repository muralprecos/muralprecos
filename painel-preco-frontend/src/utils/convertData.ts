
import { IItemSelect } from "@/interfaces/types";


export function reqDataListToSelect<T>(list: T[], prop: keyof T, val: keyof T): IItemSelect[] {
  return list ? list.map(e => ({
    label: e[prop]+'',
    value: e[val]+''
  })) : []
}