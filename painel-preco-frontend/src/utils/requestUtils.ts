import { IAPISearchInfo, IAPISearchProps } from "@/interfaces/types";

const addParam = (url: string, hasAttr: boolean, complement: string) : string => {
  return `${url}${hasAttr ? '&' : '?'}${complement}`
}

const paramToStr = (s: string | string[] | undefined) : string=> {
  return s !== undefined ? s.toString() : '';
}

export const searchParamsToInfo = (sp: { [key: string]: string | string[] | undefined }) : IAPISearchInfo[] => {
  const props : IAPISearchInfo[] = [];
  Object.keys(sp).forEach((p) => {
    props.push({
      param: p,
      val: paramToStr(sp[p])
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
}

export function showFileInOtherTab(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}