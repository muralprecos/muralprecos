import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IFornecedorSearch, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IReturnRequestAPIBasic, IItemLicitacao } from "@/interfaces/types";
import { extractParamSearch, forceParamSearch, getValParamSearch } from "@/utils/searchParamUtils";

const host = 'http://muraldeprecos.com';//'http://localhost:8080';
const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6VDIyQkJTRXFmU1RRWGp2RkpWTzFIenNENWJfdEZnbVp5dVUtNGtqaHVvIn0.eyJleHAiOjE3MDAxNDI2NDcsImlhdCI6MTcwMDEwNjY0NywianRpIjoiNjI2MDJiZjktYjVhZS00ODQ0LTgzNDUtMWE3ODZiMzJiM2NiIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTUuMjo4MjgwL3JlYWxtcy90dHNvbHV0aW9ucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMGJmMDUwNS02MThkLTRkMjItODllMy1kZTdkNjg3MDFhNTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwYWluZWwtcHJlY28iLCJzZXNzaW9uX3N0YXRlIjoiZWUxMzRmYTgtM2Q5Ny00YjAzLWE1NDAtMjQwZGU1OTAwMWZhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXR0c29sdXRpb25zIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiZWUxMzRmYTgtM2Q5Ny00YjAzLWE1NDAtMjQwZGU1OTAwMWZhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUVCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUVCIsImVtYWlsIjoiYWRtaW50dHNvbHV0aW9uc0BnbWFpbC5jb20ifQ.QrYyaDZZib65VARIC33PHONA5UjmGl0GZr3Pagy0w5cSBdwUMpW6F1nl_3dSx2wF_iXhi7oFsNvP41S_CSnq5F2Zh1H8cLiwwDCrqrK0AWZz466Ekik2AFIapGoVTldBFHE09xuUbXYR5z0b36WhCQELmcas1ColxbVO8-QJ2L-zgLJZa0enqHrzgZzdF_teERL3ySX5Ofq6ki5a0GOo4zKLZBg9fYQlfbhiedGhlWu91Y-4Gw1G7PaAwsmWmWh8guOgRsJF5zW_X1q-pAn0UmEUcqvEEY5s8S6Edipvb8OMPIppuGZiwdUW4R9-QSO-mCSwOiJeL_VMpdR3ibptMg`;
export const revalidate = 3600; // revalida os dados a cada hora


const mountUrl = (
  { path, page = 0, size = 50, info, filterFields } : IAPISearchProps) : string => {
  let url = `${host}${path}?page=${page}&size=${size}`;
  if (info != null && info.length > 0) {
    info.forEach(i => {
      const vi = encodeURIComponent(i.val);
      if(vi !== '' && i.param !== '') {
        url += `&${i.param}=${vi}`
      }
    })
  }
  if (filterFields != null && filterFields.length > 0) {
    url += `&fields=${filterFields}`
  }
  return url;
}

const doReq = async (
  { path, page, size, info, filterFields, config } : IAPISearchProps) => {
  const reqOpts = { 
    //TODO: aprimorar cache de requisições e adicionar body
    // cache: 'force-cache',
    // body: bodyData,
    next: {  },
    headers: new Headers({
      //{ 'Authorization': `Bearer ${token}` },
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    ...config
  }
  const res = await fetch(mountUrl({ path, page, size, info, filterFields}), reqOpts);
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const getGenericList =  async <T>(
  { path, page, size, info, filterFields, config } : IAPISearchProps) : Promise<T[]> => {
  return doReq({ path, page, size, info, filterFields, config });
}
const getGenericObject =  async <T>(
  { path, page, size, info, filterFields, config } : IAPISearchProps) : Promise<T> => {
  return doReq({ path, page, size, info, filterFields, config });
}
const getGenericListPageable =  async <T>(
    { path, page, size, info, filterFields, config } : IAPISearchProps
  ) : Promise<IReturnRequestAPI<T>> => {
  return doReq({ path, page, size, info, filterFields, config });
}
// const postGeneric =  async <T extends IObjetoAPI>(
//   { path, page, size, info } : IAPISearchProps) : Promise<T[]> => {
//   return doReq({ path, page, size, info, reqType: 'POST' });
// }



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
  { page, size } : IAPISearchProps) => {
  return getGenericList<IUnidadeFederativa>({ path: '/api/v1/unidades-federativas' , page, size });
}
const getListAnos = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericListPageable<IAnoCompra>({ path: '/api/v1/anos-compra' , page, size });
}

const getListMunicipios = async (
  { page, size, info, config } : IAPISearchProps) => {
  const uuiduf = getValParamSearch(info, 'uuiduf');
  info = extractParamSearch(info, 'uuiduf');
  return getGenericListPageable<IMunicipio>({ path: `/api/v1/unidades-federativas/${uuiduf}/municipios` , page, size, info, config });
}
const getListFornecedores = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size, info, config });
}
const getListOrgaos = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info, config });
}
const getListOrgaosSuperiores = async (
  { page, size, info, config } : IAPISearchProps) => {
    info = forceParamSearch(info, 'ehSuperior', 'true');
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info, config });
}
const getListUASG = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IUnidadeGestora>({ path: '/api/v1/unidades-gestoras' , page, size, info, config });
}
const getListUnidadesFornecimento = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IObjetoAPI>({ path: '/api/v1/unidades-fornecimento' , page, size, info, config });
}
const getListNomeMaterial = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<INomeMaterial>({ path: '/api/v1/materiais' , page, size, info, config });
}
const getListObjetosCompras = async (
  { page, size, info, config } : IAPISearchProps) => {
  info = forceParamSearch(info, 'only', 'true');
  return getGenericListPageable<IObjetoCompra>({ path: '/api/v1/licitacoes' , page, size, info, config });
}
const getListDescricao = async (
  { page, size, info, config } : IAPISearchProps) => {
  info = forceParamSearch(info, 'only', 'true');
  return getGenericListPageable<IItemDescricao>({ path: '/api/v1/itens-licitacao' , page, size, info, config });
}
const getItemLicitacao = async (
  { page, size, info, config } : IAPISearchProps) => {
  const uuid = getValParamSearch(info, 'uuid');
  info = extractParamSearch(info, 'uuid');
  return getGenericObject<IItemLicitacao>({ path: `/api/v1/itens-licitacao/${uuid}` , page, size, info, config });
}


const getPesquisarCotacoes = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericObject<IReturnRequestAPIBasic<IRetornoPesquisaItensLicitacao>>({ path: '/api/v1/itens-licitacao' , page, size, info, config, filterFields: 'content[uuid,descricao,quantidade,valor,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra]' });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListModalidadesCompra, getListSituacoesLicitacao, getListEstados, getListUnidadesFornecimento, getListNomeMaterial, getListMunicipios, getListAnos, getListObjetosCompras, getListDescricao, getPesquisarCotacoes, getItemLicitacao };