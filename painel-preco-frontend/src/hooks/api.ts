import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IItemLicitacao, IReturnRequestAPI } from "@/interfaces/types";
import { ResponseError, getGenericListPageable, getGenericObject, getObjectDesc, postGenericBlob } from "./genericapi";
import { extractParamSearch, forceParamSearch, getNumberOrUndefined, getValParamSearch } from "@/utils/searchParamUtils";

export const getListPorteFornecedor = async (
  { page, size } : { page?: number; size?: number }): Promise<IPorteFornecedor[]|null> => {
  return getGenericObject<IPorteFornecedor[]>({ path: '/api/v1/portes-fornecedor' , page, size });
}
export const getListEsferas = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IEsfera[]>({ path: '/api/v1/esferas' , page, size });
}
export const getFormasCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IFormaCompra[]>({ path: '/api/v1/formas-compra' , page, size });
}
export const getListModalidadesCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IModalidadeCompra[]>({ path: '/api/v1/modalidades-compra' , page, size });
}
export const getListPeriodosCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IPeriodoCompra[]>({ path: '/api/v1/periodos-compra' , page, size });
}
export const getListSituacoesLicitacao = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<ISituacaoLicitacao[]>({ path: '/api/v1/situacoes-licitacao' , page, size });
}
export const getListEstados = async (
  { page, size } : IAPISearchProps) => {
  return getGenericObject<IUnidadeFederativa[]>({ path: '/api/v1/unidades-federativas' , page, size });
}
export const getListAnos = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericListPageable<IAnoCompra>({ path: '/api/v1/anos-compra' , page, size });
}

export const getListMunicipios = async (
  { page, size, info, config } : IAPISearchProps) => {
  const uuiduf = getValParamSearch(info, 'uuiduf');
  info = extractParamSearch(info, 'uuiduf');
  return getGenericListPageable<IMunicipio>({ path: `/api/v1/unidades-federativas/${uuiduf}/municipios` , page, size, info, config });
}

export const getListFornecedores = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , page, size, info, config });
}
export const getFornecedorDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListFornecedores);
}

export const getListOrgaos = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info, config });
}
export const getListOrgaosSuperiores = async (
  { page, size, info, config } : IAPISearchProps) => {
    info = forceParamSearch(info, 'ehSuperior', 'true');
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , page, size, info, config });
}
export const getOrgaoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListOrgaos);
}

export const getListUASG = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IUnidadeGestora>({ path: '/api/v1/unidades-gestoras' , page, size, info, config });
}
export const getUASGDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUASG);
}

export const getListUnidadesFornecimento = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<IObjetoAPI>({ path: '/api/v1/unidades-fornecimento' , page, size, info, config });
}
export const getUnidadeFornecimentoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUnidadesFornecimento);
}

export const getListNomeMaterial = async (
  { page, size, info, config } : IAPISearchProps) => {
  return getGenericListPageable<INomeMaterial>({ path: '/api/v1/materiais' , page, size, info, config });
}
export const getNomeMaterialDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListNomeMaterial);
}

export const getListObjetosCompras = async (
  { page, size, info, config } : IAPISearchProps) => {
  info = forceParamSearch(info, 'only', 'true');
  return getGenericListPageable<IObjetoCompra>({ path: '/api/v1/licitacoes' , page, size, info, config });
}
export const getListDescricao = async (
  { page, size, info, config } : IAPISearchProps) => {
  info = forceParamSearch(info, 'only', 'true');
  return getGenericListPageable<IItemDescricao>({ path: '/api/v1/itens-licitacao' , page, size, info, config });
}

export const getItemLicitacao = async (
  { page, size, info, config } : IAPISearchProps) => {
  const uuid = getValParamSearch(info, 'uuid');
  info = extractParamSearch(info, 'uuid');
  return getGenericObject<IItemLicitacao>({ path: `/api/v1/itens-licitacao/${uuid}` , page, size, info, config });
}


export const FIELDS_COTACOES_LIST = 'content[uuid,descricao,quantidade,valor,licitacao.municipio.nome,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra,unidadeFornecimento.nome],pageable,last,totalElements,totalPages,size,number,sort,first,numberOfElements,empty';
export const getPesquisarCotacoes = async (
  { info, config } : IAPISearchProps) => {
    const pageinfo = getNumberOrUndefined(getValParamSearch(info, 'page'));
    const sizeinfo = getNumberOrUndefined(getValParamSearch(info, 'size'));
    return getGenericObject<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>>({ path: '/api/v1/itens-licitacao' , info, config, page: pageinfo, size: sizeinfo });
}

export const postDownloadItensCotacoes = async (
  itens: IRetornoPesquisaItensLicitacao[]) : Promise<Blob|ResponseError|null> => {
    return postGenericBlob({
      path: '/api/v1/cotacoes',
      bodydata: JSON.stringify({
        "itens": itens.map( i => i.uuid )
      }),
      acceptType: ''
    });
}