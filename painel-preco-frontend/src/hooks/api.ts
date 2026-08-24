import {
  IAPISearchProps,
  IAnoCompra,
  IEsfera,
  IFormaCompra,
  IFornecedor,
  IItemDescricao,
  IModalidadeCompra,
  IMunicipio,
  INomeMaterial,
  IObjetoAPI,
  IObjetoCompra,
  IOrgao,
  IPeriodoCompra,
  IPorteFornecedor,
  IRetornoPesquisaItensLicitacao,
  ISituacaoLicitacao,
  IUnidadeFederativa,
  IUnidadeGestora,
  IItemLicitacao,
  IReturnRequestAPI,
  IUserAuth,
  IAPISimpleSearchPropsLogged,
  IAPISearchPropsLogged,
  IHistoricoCotacao,
  IValidaCotacao,
  IProcessoContratacao,
  IProcessoContratacaoForm,
  IArtefatoGerado,
  IArtefatoSecaoLog,
  TipoArtefatoEnum,
} from "@/interfaces/types";
import {
  HOST_API_PREFIX,
  ResponseError,
  getGenericBlob,
  getGenericListPageable,
  getGenericObject,
  getObjectDesc,
  postGenericBlob,
  postGenericJson,
  putGenericJson,
  reqBodyGeneric,
} from "./genericapi";
import {
  extractParamSearch,
  forceParamSearch,
  getNumberOrUndefined,
  getValParamSearch,
} from "@/utils/searchParamUtils";

export const getDashboardResumo = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  return getGenericObject<any>({
    path:
      HOST_API_PREFIX + "/dashboard/resumo?licitacoes_page=1&cotacoes_page=1",
    accessToken,
  });
};

export const getListPorteFornecedor = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged): Promise<IPorteFornecedor[] | null> => {
  return getGenericObject<IPorteFornecedor[]>({
    path: HOST_API_PREFIX + "/portes-fornecedor",
    accessToken,
    ...opts,
  });
};
export const getListEsferas = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IEsfera[]>({
    path: HOST_API_PREFIX + "/esferas",
    accessToken,
    ...opts,
  });
};
export const getFormasCompra = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IFormaCompra[]>({
    path: HOST_API_PREFIX + "/formas-compra",
    accessToken,
    ...opts,
  });
};
export const getListModalidadesCompra = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IModalidadeCompra[]>({
    path: HOST_API_PREFIX + "/modalidades-compra",
    accessToken,
    ...opts,
  });
};
export const getListPeriodosCompra = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IPeriodoCompra[]>({
    path: HOST_API_PREFIX + "/periodos-compra",
    accessToken,
    ...opts,
  });
};
export const getListSituacoesLicitacao = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<ISituacaoLicitacao[]>({
    path: HOST_API_PREFIX + "/situacoes-licitacao",
    accessToken,
    ...opts,
  });
};
export const getListEstados = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericObject<IUnidadeFederativa[]>({
    path: HOST_API_PREFIX + "/unidades-federativas",
    accessToken,
    ...opts,
  });
};
export const getListAnos = async ({
  accessToken,
  ...opts
}: IAPISimpleSearchPropsLogged) => {
  return getGenericListPageable<IAnoCompra>({
    path: HOST_API_PREFIX + "/anos-compra",
    accessToken,
    ...opts,
  });
};

export const getListMunicipios = async (opts: IAPISearchProps) => {
  const uuiduf = getValParamSearch(opts.info, "uuiduf");
  opts.info = extractParamSearch(opts.info, "uuiduf");
  opts.path = `${HOST_API_PREFIX}/unidades-federativas/${uuiduf}/municipios`;
  return getGenericListPageable<IMunicipio>(opts);
};

export const getListFornecedores = async (opts: IAPISearchProps) => {
  return getGenericListPageable<IFornecedor>({
    path: HOST_API_PREFIX + "/fornecedores",
    ...opts,
  });
};
export const getFornecedorDesc = async (
  uuid: string
): Promise<string | null> => {
  return getObjectDesc(
    { info: [{ param: "uuid", val: uuid }] },
    getListFornecedores
  );
};

export const getListOrgaos = async (opts: IAPISearchProps) => {
  return getGenericListPageable<IOrgao>({
    path: HOST_API_PREFIX + "/orgaos",
    ...opts,
  });
};
export const getListOrgaosSuperiores = async (opts: IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, "ehSuperior", "true");
  return getGenericListPageable<IOrgao>({
    path: HOST_API_PREFIX + "/orgaos",
    ...opts,
  });
};
export const getOrgaoDesc = async (uuid: string): Promise<string | null> => {
  return getObjectDesc({ info: [{ param: "uuid", val: uuid }] }, getListOrgaos);
};

export const getListUASG = async (opts: IAPISearchProps) => {
  return getGenericListPageable<IUnidadeGestora>({
    path: HOST_API_PREFIX + "/unidades-gestoras",
    ...opts,
  });
};
export const getUASGDesc = async (uuid: string): Promise<string | null> => {
  return getObjectDesc({ info: [{ param: "uuid", val: uuid }] }, getListUASG);
};

export const getListUnidadesFornecimento = async (opts: IAPISearchProps) => {
  return getGenericListPageable<IObjetoAPI>({
    path: HOST_API_PREFIX + "/unidades-fornecimento",
    ...opts,
  });
};
export const getUnidadeFornecimentoDesc = async (
  uuid: string
): Promise<string | null> => {
  return getObjectDesc(
    { info: [{ param: "uuid", val: uuid }] },
    getListUnidadesFornecimento
  );
};

export const getListNomeMaterial = async (opts: IAPISearchProps) => {
  return getGenericListPageable<INomeMaterial>({
    path: HOST_API_PREFIX + "/materiais",
    ...opts,
  });
};
export const getNomeMaterialDesc = async (
  uuid: string
): Promise<string | null> => {
  return getObjectDesc(
    { info: [{ param: "uuid", val: uuid }] },
    getListNomeMaterial
  );
};

export const getListObjetosCompras = async (opts: IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, "only", "true");
  return getGenericListPageable<IObjetoCompra>({
    path: HOST_API_PREFIX + "/licitacoes",
    ...opts,
  });
};
export const getListDescricao = async (opts: IAPISearchProps) => {
  opts.info = forceParamSearch(opts.info, "only", "true");
  return getGenericListPageable<IItemDescricao>({
    path: HOST_API_PREFIX + "/itens-licitacao",
    ...opts,
  });
};

export const getItemLicitacao = async (opts: IAPISearchPropsLogged) => {
  const uuid = getValParamSearch(opts.info, "uuid");
  opts.info = extractParamSearch(opts.info, "uuid");
  return getGenericObject<IItemLicitacao>({
    path: `${HOST_API_PREFIX}/itens-licitacao/${uuid}`,
    ...opts,
  });
};

export const getListHistoricoCotacoes = async (opts: IAPISearchPropsLogged) => {
  return getGenericListPageable<IHistoricoCotacao>({
    path: HOST_API_PREFIX + "/cotacoes",
    ...opts,
  });
};
export const getHistoricoCotacao = async (opts: IAPISearchPropsLogged) => {
  const uuid = getValParamSearch(opts.info, "uuid");
  opts.info = extractParamSearch(opts.info, "uuid");
  return getGenericObject<IHistoricoCotacao>({
    path: `${HOST_API_PREFIX}/cotacoes/${uuid}`,
    ...opts,
  });
};

export const getValidateCotacao = async (
  hash: string
): Promise<IValidaCotacao | ResponseError | null> => {
  return postGenericJson({
    path: HOST_API_PREFIX + "/cotacoes/validacao",
    bodydata: JSON.stringify({
      hash: hash,
    }),
    acceptType: "",
  });
};

export const FIELDS_COTACOES_LIST =
  "content[uuid,descricao,quantidade,valor,licitacao.municipio.nome,licitacao.municipio.uf.nome,licitacao.dataResultadoCompra,unidadeFornecimento.nome],pageable,last,totalElements,totalPages,size,number,sort,first,numberOfElements,empty";
export const getPesquisarCotacoes = async ({
  info,
  config,
  accessToken,
}: IAPISearchPropsLogged) => {
  const pageinfo = getNumberOrUndefined(getValParamSearch(info, "page"));
  const sizeinfo = getNumberOrUndefined(getValParamSearch(info, "size"));
  return getGenericObject<IReturnRequestAPI<IRetornoPesquisaItensLicitacao>>({
    path: HOST_API_PREFIX + "/itens-licitacao",
    info,
    config,
    page: pageinfo,
    size: sizeinfo,
    accessToken: accessToken ?? undefined,
  });
};

export const postDownloadItensCotacoes = async (
  itens: IRetornoPesquisaItensLicitacao[],
  accessToken: string
): Promise<Blob | ResponseError | null> => {
  return postGenericBlob({
    path: HOST_API_PREFIX + "/cotacoes",
    bodydata: JSON.stringify({
      itens: itens.map((i) => i.uuid),
    }),
    acceptType: "",
    accessToken,
  });
};

export const postMaterializarCotacaoDoCarrinho = async (
  itens: IRetornoPesquisaItensLicitacao[],
  accessToken: string
): Promise<string | null> => {
  const res = await reqBodyGeneric({
    path: HOST_API_PREFIX + "/cotacoes",
    bodydata: JSON.stringify({
      itens: itens.map((i) => i.uuid),
    }),
    acceptType: "",
    accessToken,
    method: "POST",
  });
  return res.data?.headers.get("X-Cotacao-Uuid") ?? null;
};

export const postCreateProcessoContratacao = async (
  form: IProcessoContratacaoForm,
  accessToken: string
): Promise<IProcessoContratacao | null> => {
  return postGenericJson<IProcessoContratacao>({
    path: HOST_API_PREFIX + "/processos-contratacao",
    bodydata: JSON.stringify(form),
    accessToken,
  });
};

export const getProcessoContratacao = async (opts: IAPISearchPropsLogged) => {
  const uuid = getValParamSearch(opts.info, "uuid");
  opts.info = extractParamSearch(opts.info, "uuid");
  return getGenericObject<IProcessoContratacao>({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}`,
    ...opts,
  });
};

/** @return o processo já existente para esta cotação, ou null se nenhum foi criado ainda. */
export const getProcessoContratacaoPorCotacao = async (
  cotacaoUuid: string,
  accessToken: string
): Promise<IProcessoContratacao | null> => {
  try {
    return await getGenericObject<IProcessoContratacao>({
      path: `${HOST_API_PREFIX}/processos-contratacao/por-cotacao/${cotacaoUuid}`,
      accessToken,
    });
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return null;
    }
    throw err;
  }
};

export const putAtualizarProcessoContratacao = async (
  uuid: string,
  form: IProcessoContratacaoForm,
  accessToken: string
): Promise<IProcessoContratacao | null> => {
  return putGenericJson<IProcessoContratacao>({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}`,
    bodydata: JSON.stringify(form),
    accessToken,
  });
};

export const postGerarArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  accessToken: string
): Promise<IArtefatoGerado | null> => {
  return postGenericJson<IArtefatoGerado>({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/gerar`,
    bodydata: "",
    accessToken,
  });
};

export const postRevisarArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number,
  accessToken: string
): Promise<IArtefatoGerado | null> => {
  return postGenericJson<IArtefatoGerado>({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/revisar`,
    bodydata: "",
    accessToken,
  });
};

export const getLogSecoesArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number,
  accessToken: string
): Promise<IArtefatoSecaoLog[] | null> => {
  return getGenericObject<IArtefatoSecaoLog[]>({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/log-secoes`,
    accessToken,
  });
};

export const getDownloadArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number,
  accessToken: string
) => {
  return getGenericBlob({
    path: `${HOST_API_PREFIX}/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/download`,
    accessToken,
  });
};

export const postLogin = async (userAuth: IUserAuth) => {
  const URL = `${process.env.API_URL}${process.env.API_URL_PREFIX}/auth/logon`;

  const b = new URLSearchParams();
  b.append("username", userAuth.username);
  b.append("password", userAuth.password);

  return fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: b,
  });
};

export const postLogout = async (refreshToken: string, idToken?: string) => {
  const URL = `${process.env.API_URL}${process.env.API_URL_PREFIX}/auth/logout`;
  const b = new URLSearchParams();
  b.append("refresh_token", refreshToken);
  if (idToken) b.append("id_token_hint", idToken);
  return fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: b,
  });
};

export const postRefreshToken = async (refreshToken: string) => {
  const URL = `${process.env.API_URL}${process.env.API_URL_PREFIX}/auth/refresh`;
  const b = new URLSearchParams();
  b.append("refresh_token", refreshToken);
  return fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: b,
  });
};
