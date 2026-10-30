
import { IItemSelect } from "@/interfaces/types";


export function reqDataListToSelect<T>(list: T[] | null, prop: keyof T, val: keyof T): IItemSelect[] {
  return list != null && list.map !=null ? list.map(e => ({
    label: e[prop]+'',
    value: e[val]+''
  })) : []
}

export function strIfNotNull(str: number | string | undefined, replacestr?: string) : string {
  return str != null && (typeof str == 'string' ? str.trim() != '' : true) ? ''+str : (replacestr != null ? replacestr : '-');
}