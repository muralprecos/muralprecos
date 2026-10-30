import { IAPISearchInfo } from "@/interfaces/types";

export function getNumberOrUndefined(info: string | string[] | undefined) : number | undefined {
  const s = info != undefined ? +info : NaN;
  return isNaN(s) ? undefined : s; 
}

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

export function objToParamSearch(obj: object) : IAPISearchInfo[] {
  const info:IAPISearchInfo[] = [];
  Object.keys(obj).forEach(function(key) {
    const res = obj[key as keyof typeof obj];
    if (res != null && res != '') {
      info.push({
        param: key,
        val: res
      })
    }
  });
  return info;
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

