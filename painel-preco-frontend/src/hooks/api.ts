import { IAPISearchProps, IEsfera, IFormaCompra, IFornecedor, IFornecedorSearch, IModalidadeCompra, IObjetoAPI, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI } from "@/interfaces/types";

const host = 'http://localhost:8080';
const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6VDIyQkJTRXFmU1RRWGp2RkpWTzFIenNENWJfdEZnbVp5dVUtNGtqaHVvIn0.eyJleHAiOjE2OTg1ODI5MzQsImlhdCI6MTY5ODU0NjkzNCwianRpIjoiYmUxZjY2ZDYtYzYyYy00YTQ5LWI4ZDEtMjUzMWE0MDQwMzU0IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTUuMjo4MjgwL3JlYWxtcy90dHNvbHV0aW9ucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMGJmMDUwNS02MThkLTRkMjItODllMy1kZTdkNjg3MDFhNTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwYWluZWwtcHJlY28iLCJzZXNzaW9uX3N0YXRlIjoiYmE0MjNiNDktNzM5Mi00YzBkLWI3YTctN2I1NWQ0ZTIxNjI0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXR0c29sdXRpb25zIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYmE0MjNiNDktNzM5Mi00YzBkLWI3YTctN2I1NWQ0ZTIxNjI0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUVCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUVCIsImVtYWlsIjoiYWRtaW50dHNvbHV0aW9uc0BnbWFpbC5jb20ifQ.CmZZe1bI4u7JK3oiSzBtDahvdFY9GZPco3iHouLlizpQV2cXJ6WV5hhFsTDPIDQIkQvLWbHAceSdZE4BM3nNcvIlB58THAR4QxoszArEDvfVh-j0Rh8ZhcIhddnCET3FLrOKBbyXpaoAYiMBvbpT_OOlp1krOFLtmRsQ5DFIxdlLggL_JVCBGYX7tyb1iRsEfRbqt-83LmOzfgI7_vZvOnBDnAZvBOTJMa0EUQqfQEFJIWVpgL95C40Qyyx_60vG_NWmKceJyybOKeSz2-43v-zckx3bpT79HQ-gCodr0CMOJvAT62ViHLLVEa9xS4fdg01pQMsBtXM4MvtH1qZJ0g`;
export const revalidate = 3600; // revalida os dados a cada hora


const getGenericList =  async <T extends IObjetoAPI>(
  { path, page, size } : 
  { path: string, page: number; size: number }) : Promise<T[]> => 
{
  console.log(`${host}${path}?page=${page}&size=${size}`);
  const headers = { 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${host}${path}?page=${page}&size=${size}`, { 
    cache: 'force-cache',
    next: {  },
    headers
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const getGenericListPageable =  async <T extends IObjetoAPI>(
  { path, page, size } : 
  { path: string, page: number; size: number }) : Promise<IReturnRequestAPI<T>> => 
{
  console.log(`${host}${path}?page=${page}&size=${size}`);
  const headers = { 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${host}${path}?page=${page}&size=${size}`, { 
    cache: 'force-cache',
    next: {  },
    headers
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const getListPorteFornecedor = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IPorteFornecedor>({ path: '/api/v1/portes-fornecedor' , page, size });
}
const getListEsferas = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IEsfera>({ path: '/api/v1/esferas' , page, size });
}
const getFormasCompra = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IFormaCompra>({ path: '/api/v1/formas-compra' , page, size });
}
const getListModalidadesCompra = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IModalidadeCompra>({ path: '/api/v1/modalidades-compra' , page, size });
}
const getListPeriodosCompra = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IPeriodoCompra>({ path: '/api/v1/periodos-compra' , page, size });
}

const getListFornecedores = async (
  { page = 1, size = 10, params } : IAPISearchProps<IFornecedorSearch>) => {
    console.log(params)
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListModalidadesCompra };