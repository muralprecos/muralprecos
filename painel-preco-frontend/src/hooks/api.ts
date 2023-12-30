import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IReturnRequestAPIBasic, IItemLicitacao } from "@/interfaces/types";
import { extractParamSearch, forceParamSearch, getValParamSearch } from "@/utils/searchParamUtils";
import logger from "../../services/logger";

const host = 'http://muraldeprecos.com';//'http://localhost:8080';

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
    try {
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
      const url = mountUrl({ path, page, size, info, filterFields});
      const res = await fetch(url, reqOpts).then((resp) => {
        if (resp.status >= 400 && resp.status < 600) {
          logger.error(`Bad response from server. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${resp.status}.`);
        }
        return resp;
      }).catch((error) => {
        throw error;
      });
      if (res.ok) {
        throw new Error(`Failed to fetch. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${res.status}.`)
      }
      return res.json();
    } catch (error) {
      logger.error(error);
    }
    
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
  return getGenericObject<IReturnRequestAPIBasic<IRetornoPesquisaItensLicitacao>>({ path: '/api/v1/itens-licitacao' , page, size, info, config, filterFields: 'content[uuid,descricao,quantidade,valor,licitacao.municipio.nome,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra,unidadeFornecimento.nome]' });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListModalidadesCompra, getListSituacoesLicitacao, getListEstados, getListUnidadesFornecimento, getListNomeMaterial, getListMunicipios, getListAnos, getListObjetosCompras, getListDescricao, getPesquisarCotacoes, getItemLicitacao };