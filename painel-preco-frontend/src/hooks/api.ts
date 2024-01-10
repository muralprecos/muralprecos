import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IReturnRequestAPIBasic, IItemLicitacao } from "@/interfaces/types";
import { ResponseError, getGenericListPageable, getGenericObject, postGenericBlob } from "./genericapi";
import { extractParamSearch, forceParamSearch, getValParamSearch } from "@/utils/searchParamUtils";

const getListPorteFornecedor = async (
  { page, size } : { page?: number; size?: number }): Promise<IPorteFornecedor[]|null> => {
  return getGenericObject<IPorteFornecedor[]>({ path: '/api/v1/portes-fornecedor' , page, size });
}
const getListEsferas = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IEsfera[]>({ path: '/api/v1/esferas' , page, size });
}
const getFormasCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IFormaCompra[]>({ path: '/api/v1/formas-compra' , page, size });
}
const getListModalidadesCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IModalidadeCompra[]>({ path: '/api/v1/modalidades-compra' , page, size });
}
const getListPeriodosCompra = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<IPeriodoCompra[]>({ path: '/api/v1/periodos-compra' , page, size });
}
const getListSituacoesLicitacao = async (
  { page, size } : { page?: number; size?: number }) => {
  return getGenericObject<ISituacaoLicitacao[]>({ path: '/api/v1/situacoes-licitacao' , page, size });
}
const getListEstados = async (
  { page, size } : IAPISearchProps) => {
  return getGenericObject<IUnidadeFederativa[]>({ path: '/api/v1/unidades-federativas' , page, size });
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

const postDownloadItensCotacoes = async (
  itens: IRetornoPesquisaItensLicitacao[]) : Promise<Blob|ResponseError|null> => {
    return postGenericBlob({
      path: '/api/v1/cotacoes',
      bodydata: JSON.stringify({
        "itens": itens.map( i => i.uuid )
      }),
      acceptType: ''
    });
}


export { getListPorteFornecedor, getListPeriodosCompra, getListEsferas, getFormasCompra, getListFornecedores, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListModalidadesCompra, getListSituacoesLicitacao, getListEstados, getListUnidadesFornecimento, getListNomeMaterial, getListMunicipios, getListAnos, getListObjetosCompras, getListDescricao, getPesquisarCotacoes, getItemLicitacao, postDownloadItensCotacoes };