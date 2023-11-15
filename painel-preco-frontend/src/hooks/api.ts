import { IAPISearchProps, IEsfera, IFormaCompra, IFornecedor, IFornecedorSearch, IModalidadeCompra, IObjetoAPI, IOrgao, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora } from "@/interfaces/types";

const host = 'http://localhost:8080';
const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6VDIyQkJTRXFmU1RRWGp2RkpWTzFIenNENWJfdEZnbVp5dVUtNGtqaHVvIn0.eyJleHAiOjE3MDAwODg3MTcsImlhdCI6MTcwMDA4ODQxNywianRpIjoiMDNlYzBmOTYtMzk2Mi00ZDNjLWI2ODQtOGFiOTVhOGNkYmUwIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTUuMjo4MjgwL3JlYWxtcy90dHNvbHV0aW9ucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMGJmMDUwNS02MThkLTRkMjItODllMy1kZTdkNjg3MDFhNTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwYWluZWwtcHJlY28iLCJzZXNzaW9uX3N0YXRlIjoiMGQwYjRlZjQtYzU3Yi00NGUzLTk2MDAtNWY5NTFmMTE2ZmIwIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXR0c29sdXRpb25zIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMGQwYjRlZjQtYzU3Yi00NGUzLTk2MDAtNWY5NTFmMTE2ZmIwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUVCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUVCIsImVtYWlsIjoiYWRtaW50dHNvbHV0aW9uc0BnbWFpbC5jb20ifQ.EyYMDibCeTLLgBBp21_CAL1Vlqt0g_fqvHGeC5maeucXVdbeVkYpIB6BK3pzYBu3PwzSXZ4xsG6wzdmUckP_YnfApRwWadtRZ_eJ_SaYETv6_o5MIAqODX9DyBXiHOjoklhzbCfLc4scB5THj048XwxseAlG0-WPgyrykHdksfDBwkxBYtEgmltfr5DtCOVnYaZVWLZchabeZWVEKQ9ttPFvfIin8Pi8Fv9WpHWXG4BQGfF4zltMgPH4Vo-19kIHMjXILG_L-U0GnHixCqF7kGL84gtNRPGayAuiKTuPeVrEiFr2sOHFJsSI3pSMqP7vA1VL5IP4xeNAPXjFmdMxag`;
export const revalidate = 3600; // revalida os dados a cada hora


const getGenericList =  async <T extends IObjetoAPI>(
  { path, page = 1, size = 10, params } : 
  { path: string, page?: number; size?: number, params?: T }) : Promise<T[]> => 
{
  console.log(`${host}${path}?page=${page}&size=${size}`);

  if (params)
    console.log(Object.entries(params))
  //params.append()
  
  // const new_params = new URLSearchParams([
  //   ...Array.from(url.searchParams.entries()), // [["a","hello"],["b","world"]]
  //   ...Object.entries(add_params), // [["c","a"],["d","2"],["e","false"]]
  // ]).toString();

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
  { path, page = 1, size = 10, info } : 
  { path: string, page?: number; size?: number, info? : [{
    val: string
    param: string
  }] }) : Promise<IReturnRequestAPI<T>> => 
{

  //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams

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
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<IPorteFornecedor>({ path: '/api/v1/portes-fornecedor' , page, size });
}
const getListEsferas = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<IEsfera>({ path: '/api/v1/esferas' , page, size });
}
const getFormasCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<IFormaCompra>({ path: '/api/v1/formas-compra' , page, size });
}
const getListModalidadesCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<IModalidadeCompra>({ path: '/api/v1/modalidades-compra' , page, size });
}
const getListPeriodosCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<IPeriodoCompra>({ path: '/api/v1/periodos-compra' , page, size });
}
const getListSituacoesLicitacao = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericList<ISituacaoLicitacao>({ path: '/api/v1/situacoes-licitacao' , page, size });
}


const getListFornecedores = async (
  { page, size, info } : IAPISearchProps<IFornecedor>) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size });
}
const getListOrgaos = async (
  { page, size, info } : IAPISearchProps<IOrgao>) => {
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size });
}
const getListUASG = async (
  { page, size, info } : IAPISearchProps<IUnidadeGestora>) => {
  return getGenericListPageable<IUnidadeGestora>({ path: '/api/v1/unidades-gestoras' , page, size });
}

const getListEstados = async (
  { page, size, info } : IAPISearchProps<IUnidadeFederativa>) => {
  return getGenericListPageable<IUnidadeFederativa>({ path: '/api/v1/unidades-federativas' , page, size, info });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListOrgaos, getListUASG, getListModalidadesCompra, getListSituacoesLicitacao, getListEstados };