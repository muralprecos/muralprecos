import { IEsfera, IFormaCompra, IFornecedor, IModalidadeCompra, IObjetoAPI, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI } from "@/interfaces/types";

const host = 'http://localhost:8080';
const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6VDIyQkJTRXFmU1RRWGp2RkpWTzFIenNENWJfdEZnbVp5dVUtNGtqaHVvIn0.eyJleHAiOjE2OTY0MjUwNjAsImlhdCI6MTY5NjM4OTA2MCwianRpIjoiYTg4OGViYzctNTE0MC00NTAwLWE4NWYtYmExMTBkY2Q4N2M5IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTUuMjo4MjgwL3JlYWxtcy90dHNvbHV0aW9ucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMGJmMDUwNS02MThkLTRkMjItODllMy1kZTdkNjg3MDFhNTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwYWluZWwtcHJlY28iLCJzZXNzaW9uX3N0YXRlIjoiOWQyNTg2ZWYtMGY0OS00NTM0LTk5NjgtMGYwYjRiZDU1YTkyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXR0c29sdXRpb25zIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiOWQyNTg2ZWYtMGY0OS00NTM0LTk5NjgtMGYwYjRiZDU1YTkyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUVCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUVCIsImVtYWlsIjoiYWRtaW50dHNvbHV0aW9uc0BnbWFpbC5jb20ifQ.Lc20rva7bdF-clcpoP-vHUM1d4fWu8TvuvEX-srf5waxcZly50tx1Gp5kJT3m48HWyjQ25TykUpyhw2asuzpx2mC_TWQg4H0gtSkP5E3cn-wx3ClcxhBN8luF4tppLXfwp6VN5Dx-r3KzjevmaEESvFUneaBAgnPn4_kOqr6_A2WrJf5ae4LxMNPLnvmWJU_2fwClYNC9s6qnt4ckMjTu-e1Y4yhkpvRd2hLn3nNqRS-EXSoGAmTEHXM9j_n1jEckX2NL-GzZiWrANOAkMkSq4BzrVDMRIG8S6e75BEmT1kV6EP6HM0FRYyg5_hx1HGtO_NR7pYnnNfXMWdrk6X2yQ`;
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
const getListFornecedores = async (
    { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size });
}
const getListModalidadesCompra = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IModalidadeCompra>({ path: '/api/v1/modalidades-compra' , page, size });
}
const getListPeriodosCompra = async (
  { page = 1, size = 10 } : { page?: number; size?: number }) => {
  return getGenericList<IPeriodoCompra>({ path: '/api/v1/periodos-compra' , page, size });
}

export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListModalidadesCompra };