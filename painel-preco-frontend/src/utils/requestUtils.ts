import { IAPISearchInfo, IAPISearchProps } from "@/interfaces/types";
import { ReadonlyURLSearchParams } from "next/navigation";

const addParam = (url: string, hasAttr: boolean, complement: string) : string => {
  return `${url}${hasAttr ? '&' : '?'}${complement}`
}

export const searchParamsToInfo = (sp: ReadonlyURLSearchParams) : IAPISearchInfo[] => {
  const props : IAPISearchInfo[] = [];
  sp.forEach((v, k) => {
    props.push({
      param: k,
      val: v
    })
  })
  return props;
}

export function mountUrl ({ host, path, page, size, info, filterFields } : IAPISearchProps) : string {
    let hasAttr = false, hasPage = false, hasSize = false;
    let url = `${host}${path}`;
    if (info != null && info.length > 0) {
      info.forEach(i => {
        const vi = encodeURIComponent(i.val);
        if(vi !== '' && i.param !== '') {
          if (i.param == 'page') { hasPage = true };
          if (i.param == 'size') { hasSize = true };
          url = addParam(url, hasAttr, `${i.param}=${vi}`);
          hasAttr = true;
        }
      })
    }
    if (page != null && !hasPage) { url = addParam(url, hasAttr, `page=${page}`); hasAttr = true; }
    if (size != null && !hasSize) { url = addParam(url, hasAttr, `size=${size}`); hasAttr = true; }
    if (filterFields != null && filterFields.length > 0) {
      url = addParam(url, hasAttr, `fields=${filterFields}`);
      hasAttr = true;
    }
    return url;
}

export function downloadFile(blob: Blob, filename: string) {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    throw new Error('Não foi possível realizar o download do arquivo.');
  }
  
}

export function showFileInOtherTab(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}