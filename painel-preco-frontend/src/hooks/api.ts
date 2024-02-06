import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IItemLicitacao, IReturnRequestAPI, IUserAuth, IUserInfo, IUserKeyCloak, IUser } from "@/interfaces/types";
import { ResponseError, getGenericListPageable, getGenericObject, getObjectDesc, postGenericBlob, postGenericJson } from "./genericapi";
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
  opts : IAPISearchProps) => {
  const uuiduf = getValParamSearch(opts.info, 'uuiduf');
  opts.info = extractParamSearch(opts.info, 'uuiduf');
  opts.path = `/api/v1/unidades-federativas/${uuiduf}/municipios`;
  return getGenericListPageable<IMunicipio>(opts);
}

export const getListFornecedores = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IFornecedor>({ path: '/api/v1/fornecedores' , ...opts });
}
export const getFornecedorDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListFornecedores);
}

export const getListOrgaos = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , ...opts });
}
export const getListOrgaosSuperiores = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'ehSuperior', 'true');
  return getGenericListPageable<IOrgao>({ path: '/api/v1/orgaos' , ...opts });
}
export const getOrgaoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListOrgaos);
}

export const getListUASG = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IUnidadeGestora>({ path: '/api/v1/unidades-gestoras' , ...opts });
}
export const getUASGDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUASG);
}

export const getListUnidadesFornecimento = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IObjetoAPI>({ path: '/api/v1/unidades-fornecimento' , ...opts });
}
export const getUnidadeFornecimentoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUnidadesFornecimento);
}

export const getListNomeMaterial = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<INomeMaterial>({ path: '/api/v1/materiais' , ...opts });
}
export const getNomeMaterialDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListNomeMaterial);
}

export const getListObjetosCompras = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'only', 'true');
  return getGenericListPageable<IObjetoCompra>({ path: '/api/v1/licitacoes' , ...opts });
}
export const getListDescricao = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'only', 'true');
  return getGenericListPageable<IItemDescricao>({ path: '/api/v1/itens-licitacao' , ...opts });
}

export const getItemLicitacao = async (
  opts : IAPISearchProps) => {
  const uuid = getValParamSearch(opts.info, 'uuid');
  opts.info = extractParamSearch(opts.info, 'uuid');
  return getGenericObject<IItemLicitacao>({ path: `/api/v1/itens-licitacao/${uuid}` , ...opts });
}


export const FIELDS_COTACOES_LIST = 'content[uuid,descricao,quantidade,valor,licitacao.municipio.nome,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra,unidadeFornecimento.nome],pageable,last,totalElements,totalPages,size,number,sort,first,numberOfElements,empty';
export const getPesquisarCotacoes = async (
  { info, config, auth } : IAPISearchProps) => {
    const pageinfo = getNumberOrUndefined(getValParamSearch(info, 'page'));
    const sizeinfo = getNumberOrUndefined(getValParamSearch(info, 'size'));
    return getGenericObject<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>>({ path: '/api/v1/itens-licitacao' , info, config, page: pageinfo, size: sizeinfo, auth });
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

export const postLogin = async (
  userAuth: IUserAuth) => {
    const b = new URLSearchParams();
    b.append('client_id', 'mural-preco');
    b.append('client_secret', 'sivs0FpnTAUvVAdNo55m9ZhuXYvpBQ28');
    b.append('grant_type', 'password');
    b.append('username', userAuth.login);
    b.append('password', userAuth.password);
    return postGenericJson<IUserKeyCloak>({
      path: '/api/v1/auth/logon',
      bodydata: b,
      contentType: 'application/x-www-form-urlencoded'
    });
}