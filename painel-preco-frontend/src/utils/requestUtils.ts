import { IAPISearchProps } from "@/interfaces/types";

const addParam = (url: string, hasAttr: boolean, complement: string) : string => {
  return `${url}${hasAttr ? '&' : '?'}${complement}`
}

export function mountUrl ({ host, path, page, size, info, filterFields } : IAPISearchProps) : string {
    let hasAttr = false;
    let url = `${host}${path}`;
    if (page != null) { url = addParam(url, hasAttr, `page=${page}`); hasAttr = true; }
    if (size != null) { url = addParam(url, hasAttr, `size=${size}`); hasAttr = true; }
    if (info != null && info.length > 0) {
      info.forEach(i => {
        const vi = encodeURIComponent(i.val);
        if(vi !== '' && i.param !== '') {
          url = addParam(url, hasAttr, `${i.param}=${vi}`);
          hasAttr = true;
        }
      })
    }
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