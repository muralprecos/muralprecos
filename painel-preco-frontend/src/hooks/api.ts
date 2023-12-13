import { IAPISearchProps, IEsfera, IFormaCompra, IFornecedor, IFornecedorSearch, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IOrgao, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora } from "@/interfaces/types";
import { extractParamSearch, forceParamSearch, getValParamSearch } from "@/utils/searchParamUtils";

const host = 'http://muraldeprecos.com';//'http://localhost:8080';
const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6VDIyQkJTRXFmU1RRWGp2RkpWTzFIenNENWJfdEZnbVp5dVUtNGtqaHVvIn0.eyJleHAiOjE3MDAxNDI2NDcsImlhdCI6MTcwMDEwNjY0NywianRpIjoiNjI2MDJiZjktYjVhZS00ODQ0LTgzNDUtMWE3ODZiMzJiM2NiIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTUuMjo4MjgwL3JlYWxtcy90dHNvbHV0aW9ucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMGJmMDUwNS02MThkLTRkMjItODllMy1kZTdkNjg3MDFhNTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwYWluZWwtcHJlY28iLCJzZXNzaW9uX3N0YXRlIjoiZWUxMzRmYTgtM2Q5Ny00YjAzLWE1NDAtMjQwZGU1OTAwMWZhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXR0c29sdXRpb25zIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiZWUxMzRmYTgtM2Q5Ny00YjAzLWE1NDAtMjQwZGU1OTAwMWZhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUVCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUVCIsImVtYWlsIjoiYWRtaW50dHNvbHV0aW9uc0BnbWFpbC5jb20ifQ.QrYyaDZZib65VARIC33PHONA5UjmGl0GZr3Pagy0w5cSBdwUMpW6F1nl_3dSx2wF_iXhi7oFsNvP41S_CSnq5F2Zh1H8cLiwwDCrqrK0AWZz466Ekik2AFIapGoVTldBFHE09xuUbXYR5z0b36WhCQELmcas1ColxbVO8-QJ2L-zgLJZa0enqHrzgZzdF_teERL3ySX5Ofq6ki5a0GOo4zKLZBg9fYQlfbhiedGhlWu91Y-4Gw1G7PaAwsmWmWh8guOgRsJF5zW_X1q-pAn0UmEUcqvEEY5s8S6Edipvb8OMPIppuGZiwdUW4R9-QSO-mCSwOiJeL_VMpdR3ibptMg`;
export const revalidate = 3600; // revalida os dados a cada hora


const getGenericList =  async <T extends IObjetoAPI>(
  { path, page = 0, size = 50, params } : 
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

  const headers = {};//{ 'Authorization': `Bearer ${token}` };
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
    { path, page = 0, size = 50, info } : IAPISearchProps<T>
  ) : Promise<IReturnRequestAPI<T>> => {

  let url = `${host}${path}?page=${page}&size=${size}`;
  if (info != null && info.length > 0) {
    info.forEach(i => {
      const vi = encodeURIComponent(i.val);
      if(vi !== '' && i.param !== '') {
        url += `&${i.param}=${vi}`
      }
    })
  }
  
  const headers = {};//{ 'Authorization': `Bearer ${token}` };
  const res = await fetch(url, { 
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

const getListEstados = async (
  { page, size } : IAPISearchProps<IUnidadeFederativa>) => {
  return getGenericList<IUnidadeFederativa>({ path: '/api/v1/unidades-federativas' , page, size });
}

const getListMunicipios = async (
  { page, size, info } : IAPISearchProps<IMunicipio>) => {
  const uuiduf = getValParamSearch(info, 'uuiduf');
  info = extractParamSearch(info, 'uuiduf');
  return getGenericListPageable<IMunicipio>({ path: `/api/v1/unidades-federativas/${uuiduf}/municipios` , page, size, info });
}

const getListFornecedores = async (
  { page, size, info } : IAPISearchProps<IFornecedor>) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size, info });
}
const getListOrgaos = async (
  { page, size, info } : IAPISearchProps<IOrgao>) => {
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info });
}
const getListOrgaosSuperiores = async (
  { page, size, info } : IAPISearchProps<IOrgao>) => {
    info = forceParamSearch(info, 'ehSuperior', 'true');
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info });
}
const getListUASG = async (
  { page, size, info } : IAPISearchProps<IUnidadeGestora>) => {
  return getGenericListPageable<IUnidadeGestora>({ path: '/api/v1/unidades-gestoras' , page, size, info });
}
const getListUnidadesFornecimento = async (
  { page, size, info } : IAPISearchProps<IObjetoAPI>) => {
  return getGenericListPageable<IObjetoAPI>({ path: '/api/v1/unidades-fornecimento' , page, size, info });
}
const getListNomeMaterial = async (
  { page, size, info } : IAPISearchProps<INomeMaterial>) => {
  return getGenericListPageable<INomeMaterial>({ path: '/api/v1/materiais' , page, size, info });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListModalidadesCompra, getListSituacoesLicitacao, getListEstados, getListUnidadesFornecimento, getListNomeMaterial, getListMunicipios };