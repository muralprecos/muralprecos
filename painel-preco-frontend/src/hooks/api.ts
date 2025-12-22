import { IAPISearchProps, IAnoCompra, IEsfera, IFormaCompra, IFornecedor, IItemDescricao, IModalidadeCompra, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IPeriodoCompra, IPorteFornecedor, IRetornoPesquisaItensLicitacao, ISituacaoLicitacao, IUnidadeFederativa, IUnidadeGestora, IItemLicitacao, IReturnRequestAPI, IUserAuth, IAPISimpleSearchPropsLogged, IAPISearchPropsLogged, IHistoricoCotacao, IValidaCotacao } from "@/interfaces/types";
import { HOST_API_PREFIX, ResponseError, getGenericListPageable, getGenericObject, getObjectDesc, postGenericBlob, postGenericJson } from "./genericapi";
import { extractParamSearch, forceParamSearch, getNumberOrUndefined, getValParamSearch } from "@/utils/searchParamUtils";

export const getDashboardResumo = async ({ accessToken }: { accessToken: string }) => {
  return getGenericObject<any>({
    path: HOST_API_PREFIX + '/dashboard/resumo?licitacoes_page=1&cotacoes_page=1',
    accessToken,
  });
};

export const getListPorteFornecedor = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged): Promise<IPorteFornecedor[]|null> => {
  return getGenericObject<IPorteFornecedor[]>({ path: HOST_API_PREFIX + '/portes-fornecedor' , accessToken, ...opts });
}
export const getListEsferas = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IEsfera[]>({ path: HOST_API_PREFIX + '/esferas', accessToken, ...opts });
}
export const getFormasCompra = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IFormaCompra[]>({ path: HOST_API_PREFIX + '/formas-compra' , accessToken, ...opts });
}
export const getListModalidadesCompra = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IModalidadeCompra[]>({ path: HOST_API_PREFIX + '/modalidades-compra' , accessToken, ...opts });
}
export const getListPeriodosCompra = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IPeriodoCompra[]>({ path: HOST_API_PREFIX + '/periodos-compra' , accessToken, ...opts });
}
export const getListSituacoesLicitacao = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<ISituacaoLicitacao[]>({ path: HOST_API_PREFIX + '/situacoes-licitacao' , accessToken, ...opts });
}
export const getListEstados = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IUnidadeFederativa[]>({ path: HOST_API_PREFIX + '/unidades-federativas' , accessToken, ...opts });
}
export const getListAnos = async (
  { accessToken, ...opts } : IAPISimpleSearchPropsLogged) => {
  return getGenericListPageable<IAnoCompra>({ path: HOST_API_PREFIX + '/anos-compra' , accessToken, ...opts });
}

export const getListMunicipios = async (
  opts : IAPISearchProps) => {
  const uuiduf = getValParamSearch(opts.info, 'uuiduf');
  opts.info = extractParamSearch(opts.info, 'uuiduf');
  opts.path = `${HOST_API_PREFIX}/unidades-federativas/${uuiduf}/municipios`;
  return getGenericListPageable<IMunicipio>(opts);
}

export const getListFornecedores = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IFornecedor>({ path: HOST_API_PREFIX + '/fornecedores' , ...opts });
}
export const getFornecedorDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListFornecedores);
}

export const getListOrgaos = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IOrgao>({ path: HOST_API_PREFIX + '/orgaos' , ...opts });
}
export const getListOrgaosSuperiores = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'ehSuperior', 'true');
  return getGenericListPageable<IOrgao>({ path: HOST_API_PREFIX + '/orgaos' , ...opts });
}
export const getOrgaoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListOrgaos);
}

export const getListUASG = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IUnidadeGestora>({ path: HOST_API_PREFIX + '/unidades-gestoras' , ...opts });
}
export const getUASGDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUASG);
}

export const getListUnidadesFornecimento = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<IObjetoAPI>({ path: HOST_API_PREFIX + '/unidades-fornecimento' , ...opts });
}
export const getUnidadeFornecimentoDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListUnidadesFornecimento);
}

export const getListNomeMaterial = async (
  opts : IAPISearchProps) => {
  return getGenericListPageable<INomeMaterial>({ path: HOST_API_PREFIX + '/materiais' , ...opts });
}
export const getNomeMaterialDesc = async (uuid: string) : Promise<string | null> => {
  return getObjectDesc({info: [{param: 'uuid', val: uuid}]}, getListNomeMaterial);
}

export const getListObjetosCompras = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'only', 'true');
  return getGenericListPageable<IObjetoCompra>({ path: HOST_API_PREFIX + '/licitacoes' , ...opts });
}
export const getListDescricao = async (
  opts : IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, 'only', 'true');
  return getGenericListPageable<IItemDescricao>({ path: HOST_API_PREFIX + '/itens-licitacao' , ...opts });
}

export const getItemLicitacao = async (
  opts : IAPISearchPropsLogged) => {
  const uuid = getValParamSearch(opts.info, 'uuid');
  opts.info = extractParamSearch(opts.info, 'uuid');
  return getGenericObject<IItemLicitacao>({ path: `${HOST_API_PREFIX}/itens-licitacao/${uuid}` , ...opts });
}

export const getListHistoricoCotacoes = async (
  opts : IAPISearchPropsLogged) => {
  return getGenericListPageable<IHistoricoCotacao>({ path: HOST_API_PREFIX + '/cotacoes' , ...opts });
}
export const getHistoricoCotacao = async (
  opts : IAPISearchPropsLogged) => {
  const uuid = getValParamSearch(opts.info, 'uuid');
  opts.info = extractParamSearch(opts.info, 'uuid');
  return getGenericObject<IHistoricoCotacao>({ path: `${HOST_API_PREFIX}/cotacoes/${uuid}` , ...opts });
}

export const getValidateCotacao = async (
  hash: string
  ) : Promise<IValidaCotacao|ResponseError|null> => {
    return postGenericJson({
      path: HOST_API_PREFIX + '/cotacoes/validacao',
      bodydata: JSON.stringify({
        "hash": hash
      }),
      acceptType: ''
    });
}


export const FIELDS_COTACOES_LIST = 'content[uuid,descricao,quantidade,valor,licitacao.municipio.nome,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra,unidadeFornecimento.nome],pageable,last,totalElements,totalPages,size,number,sort,first,numberOfElements,empty';
export const getPesquisarCotacoes = async (
  { info, config, accessToken } : IAPISearchPropsLogged) => {
    const pageinfo = getNumberOrUndefined(getValParamSearch(info, 'page'));
    const sizeinfo = getNumberOrUndefined(getValParamSearch(info, 'size'));
    return getGenericObject<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>>({ path: HOST_API_PREFIX + '/itens-licitacao' , info, config, page: pageinfo, size: sizeinfo, accessToken: accessToken ?? undefined });
}

export const postDownloadItensCotacoes = async (
  itens: IRetornoPesquisaItensLicitacao[],
  accessToken: string
  ) : Promise<Blob|ResponseError|null> => {
    return postGenericBlob({
      path: HOST_API_PREFIX + '/cotacoes',
      bodydata: JSON.stringify({
        "itens": itens.map( i => i.uuid )
      }),
      acceptType: '',
      accessToken
    });
}

export const postLogin = async (
  userAuth: IUserAuth) => {
    const URL = `${process.env.GET_TOKEN_URL}`;

    if (!URL) {
      // console.error("❌ GET_TOKEN_URL não configurada");
      throw new Error("GET_TOKEN_URL não configurada");
    }

    const b = new URLSearchParams();
    b.append('client_id', `${process.env.KEYCLOAK_ID}`);
    b.append('client_secret', `${process.env.KEYCLOAK_SECRET}`);
    b.append('grant_type', 'password');
    b.append('scope', 'openid');
    b.append('username', userAuth.username);
    b.append('password', userAuth.password);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      return await fetch(URL, { 
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: b,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
}

export const postLogout = async (idToken: string) => {
    const URL = `${process.env.END_SESSION_URL}`;
    const b = new URLSearchParams();
    b.append('client_id', `${process.env.KEYCLOAK_ID}`);
    b.append('id_token_hint', idToken);
    return fetch(URL, { 
      method: "POST",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: b
    });
}

export const postAuthGrantClientCredentialsKeycloak = async () => {
  const GET_TOKEN_URL = `${process.env.GET_TOKEN_URL}`;
  const KEYCLOAK_ID = `${process.env.KEYCLOAK_ID}`;
  const KEYCLOAK_SECRET = `${process.env.KEYCLOAK_SECRET}`;
  return fetch(`${GET_TOKEN_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: KEYCLOAK_ID,
      client_secret: KEYCLOAK_SECRET,
      grant_type: 'client_credentials',
    }),
  })
}

export const putChangeUserDataKeycloak = async (userId: any, adminToken: any, userData: any) => {
  const KEYCLOAK_URL_ADMIN = `${process.env.KEYCLOAK_ADMIN}`;
  return fetch(`${KEYCLOAK_URL_ADMIN}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(userData),
  })
}

export const putChangeUserPasswordKeycloak = async (userId: any, adminToken: any, newPassword: string) => {
  const KEYCLOAK_URL_ADMIN = `${process.env.KEYCLOAK_ADMIN}`;
  return fetch(`${KEYCLOAK_URL_ADMIN}/users/${userId}/reset-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      type: 'password',
      value: newPassword,
      temporary: false,
    }),
  })
}