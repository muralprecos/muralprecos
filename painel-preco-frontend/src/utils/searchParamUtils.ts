import { IAPISearchInfo, IObjetoAPI } from "@/interfaces/types";

export function getValParamSearch(info: IAPISearchInfo[] | undefined, param: string) : string {
  let res = '';
  if (info != null) {
    const infres = info.filter(el => ( param == el.param ));
    if (infres.length) {
      res = infres[0].val;
    }
  }
  return res;
}

export function extractParamSearch(info: IAPISearchInfo[] | undefined, param: string) : IAPISearchInfo[] {
  if (info != null) {
    return info.filter(el => ( param != el.param ))
  }
  return []
}

export function forceParamSearch(info: IAPISearchInfo[] | undefined, param: string, val: string): IAPISearchInfo[] {
  const obj = {
    val: val,
    param: param
  }
  if (info == null) {
    info = [obj]
  } else {
    let hasParam = false;
    info.forEach((i) => {
      if (i.param == param) {
        hasParam = true;
        i.val = val;
      }
    })
    if (!hasParam) {
      info.push(obj)
    }
  }
  return info;
}

