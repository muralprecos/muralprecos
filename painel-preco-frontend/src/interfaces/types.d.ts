export interface ISimpleObjetoAPI {
  nome: string;
}

export interface IObjetoAPI extends ISimpleObjetoAPI {
  uuid: string;
}

export interface IObjetoAPISearch {
  uuid?: string;
  nome?: string;
}

export interface IFornecedor extends IObjetoAPI {
  documento: string;
  porte: IPorteFornecedor;
}

export interface IFornecedorSearch extends IObjetoAPISearch {
  documento?: string;
}

export interface IFormaCompra extends IObjetoAPI {
  sigla: string;
}

export interface IModalidadeCompra extends IObjetoAPI {
  codigo: number;
}

export interface IOrgao extends IObjetoAPI {
  codigo: number;
  ehsuperior?: booelan;
  superior?: IOrgao;
}

export interface INomeMaterial extends IObjetoAPI {
  codigo: number;
}

export interface IUnidadeFederativa extends IObjetoAPI {
  sigla: string;
}

export interface IMunicipio extends IObjetoAPI {
  uf: IUnidadeFederativa;
}

export interface IUnidadeGestora extends IObjetoAPI {
  codigo: number;
}

export interface IEsfera extends IObjetoAPI {}

export interface IPorteFornecedor extends IObjetoAPI {}

export interface ISituacaoLicitacao extends IObjetoAPI {}

export interface IPeriodoCompra extends IObjetoAPI {}

export interface IAnoCompra extends ISimpleObjetoAPI {}

export interface IObjetoCompra extends ISimpleObjetoAPI {}

export interface IItemDescricao extends ISimpleObjetoAPI {}

export interface IItemDescricaoComplementar extends ISimpleObjetoAPI {}

export interface IUnidadeFornecimento extends IObjetoAPI {}

export interface IHistoricoCotacao extends IObjetoAPI {
  nomeArquivo: string;
  stringBusca: string;
  hashValidacao: string;
  arquivo: string;
  criadoEm: string;
}

type NameValue<T extends IObjetoAPI> = {
  [K in keyof T]: {
    name: K;
    value: T[K];
  };
}[keyof T];
export interface IPageableSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface IPageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: IPageableSort;
}

export interface IReturnRequestAPI<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  sort: IPageableSort;
  totalElements: number;
  totalPages: number;
}

export interface IItemAutocomplete {
  key: React.Key;
  description: string;
}

export interface IItemSelect {
  value: string;
  label: string;
}

export interface IAPISimpleSearchPropsLogged extends IAPISimpleSearchProps {
  accessToken: string;
}

export interface IAPISimpleSearchProps {
  page?: number;
  size?: number;
  accessToken?: string;
}

export interface IAPISearchPropsLogged extends IAPISearchProps {
  accessToken: string;
}

export interface IAPISearchProps {
  host?: string;
  path?: string;
  page?: number;
  size?: number;
  info?: IAPISearchInfo[];
  filterFields?: string;
  config?: RequestInit;
  bodydata?: BodyInit;
  contentType?: string;
  acceptType?: string;
  accessToken?: string;
}

export interface IAPISearchInfo {
  val: string;
  param: string;
}

export interface IReturnRequestAPIBasic<T> {
  content: T[];
}

export interface IRetornoPesquisaItensLicitacao
  extends Pick<
      IItemLicitacao,
      | "uuid"
      | "descricao"
      | "descricaoComplementar"
      | "quantidade"
      | "valor"
      | "unidadeFornecimento"
      | "licitacao"
      | "fornecedor"
    >,
    Partial<IItemLicitacao> {
  licitacao: Pick<ILicitacao, "municipio" | "dataResultadoCompra"> &
    Partial<ILicitacao>;
}
// uuid: string
// descricao: string
// quantidade: number
// valor: number
// licitacao: {
//   municipio: {
//     nome: string
//     uf: {
//       nome: string
//     }
//   }
//   dataResultadoCompra: string
// }
// unidadeFornecimento: {
//   nome: string
// }
// }

export type IValidaCotacao = {
  uuid: string;
  nome: string;
  nomeArquivo: string;
  stringBusca: string;
  hashValidacao: string;
  arquivo: string;
  criadoEm: string;
};

export type IResValidacaoCotacao = {
  uuid: string;
  isok: boolean;
  message: string;
  validacao?: IValidaCotacao;
};

export interface IItemLicitacao {
  uuid: string;
  codigo: number;
  descricao: string;
  descricaoComplementar: string;
  unidadeFornecimento: IUnidadeFornecimento;
  quantidade: number;
  valor: string;
  material: INomeMaterial;
  fornecedor: IFornecedor;
  licitacao: ILicitacao;
  links?: [
    {
      nome: string;
      url: string;
    }
  ];
}

export interface ILicitacao {
  uuid: string;
  numero: number;
  unidadeGestora: IUnidadeGestora;
  modalidadeCompra: IModalidadeCompra;
  numeroProcesso: string;
  objeto: string;
  situacao: ISituacaoLicitacao;
  orgao: IOrgao;
  orgaoSuperior: IOrgao;
  municipio: IMunicipio;
  formaCompra: IFormaCompra;
  esfera: IEsfera;
  dataAbertura: any;
  dataResultadoCompra: string;
  valor: number;
  anoCompra: number;
  periodoCompra: string;
}

export interface IOrganizacao {
  uuid: string;
  nome: string;
  unidade: {
    uuid: string;
    nome: string;
  };
}

export interface IUserInfo {
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  organizacao: IOrganizacao;
  preferred_username: string;
  realm_access: {
    roles: string[] | null;
  };
}

export interface IUserKeyCloakRequest {
  firstName: string;
  lastName: string;
  email: string;
  newPassword?: string;
}

export interface IUserAuth {
  username: string;
  password: string;
}

export interface IUserRequest {
  userInfo: IUserInfo | null;
  userToken: IUserKeyCloak | null;
}

export interface IUserKeyCloak {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: number;
  token_type: "Bearer";
  session_state: string;
  scope: string;
}

export interface IUser {
  isAuth: boolean;
  error: string | null;
  user: IUserRequest | null;
}

export interface ICartItem {
  user: string;
  item: IRetornoPesquisaItensLicitacao;
}

export interface ICart {
  [user: string]: IRetornoPesquisaItensLicitacao[];
}

//type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (props?: Merge<DOMAttributes, P>, ref?: React.Ref<any>) => R & React.RefAttributes<any>;

export interface IConversationIAHistory {
  sender?: string;
  role: string;
  content: string;
}

export type ModalidadeProcessoEnum = "PREGAO" | "CONCORRENCIA";
export type CriterioJulgamentoProcessoEnum =
  | "MENOR_PRECO"
  | "MAIOR_DESCONTO"
  | "TECNICA_E_PRECO";
export type RegimeExecucaoProcessoEnum =
  | "COM_DEDICACAO_MAO_DE_OBRA"
  | "SEM_DEDICACAO_MAO_DE_OBRA"
  | "COMPRAS"
  | "OBRAS";
export type PrazoVigenciaFundamentoEnum =
  | "ART_105"
  | "ART_106_107"
  | "ART_75_VIII";
export type MarcoInicioExecucaoEnum = "ASSINATURA_CONTRATO" | "ORDEM_SERVICO";
export type StatusProcessoContratacaoEnum =
  | "INTAKE"
  | "EM_GERACAO"
  | "RASCUNHO_DISPONIVEL"
  | "CONCLUIDO";
export type TipoArtefatoEnum = "ETP" | "TR" | "EDITAL";
export type StatusArtefatoEnum = "RASCUNHO" | "REVISADO";
export type OrigemSecaoLogEnum =
  | "DETERMINISTICO"
  | "LLM_SELECAO_CLAUSULA"
  | "LLM_REDACAO_LIVRE";

export interface IItemProcessoContratacao {
  numeroItem: string | null;
  descricao: string;
  descricaoComplementar: string | null;
  unidadeFornecimento: string | null;
  quantidade: number;
  valorUnitario: number | null;
  valorTotal: number | null;
  fornecedorNome: string | null;
  fornecedorDocumento: string | null;
  licitacaoNumeroPncp: string | null;
  licitacaoModalidade: string | null;
  licitacaoUf: string | null;
}

export interface IArtefatoGerado {
  uuid: string;
  tipo: TipoArtefatoEnum;
  versao: number;
  status: StatusArtefatoEnum;
  nomeArquivo: string;
  geradoEm: string;
  revisadoEm: string | null;
}

export interface IArtefatoSecaoLog {
  secaoChave: string;
  origem: OrigemSecaoLogEnum;
  clausulaSelecionada: string | null;
  factsEnviados: string;
  respostaBruta: string;
}

export interface IProcessoContratacao {
  uuid: string;
  cotacaoUuid: string;
  objeto: string | null;
  justificativaNecessidade: string | null;
  modalidadePretendida: ModalidadeProcessoEnum | null;
  criterioJulgamento: CriterioJulgamentoProcessoEnum | null;
  regimeExecucao: RegimeExecucaoProcessoEnum | null;
  prazoVigenciaMeses: number | null;
  prazoVigenciaFundamentoLegal: PrazoVigenciaFundamentoEnum | null;
  tipoObjetoContinuo: boolean | null;
  orcamentoSigiloso: boolean;
  registroPrecos: boolean;
  tratamentoFavorecidoMeEpp: boolean;
  dotacaoGestaoUnidade: string | null;
  dotacaoFonteRecursos: string | null;
  dotacaoProgramaTrabalho: string | null;
  dotacaoElementoDespesa: string | null;
  dotacaoPlanoInterno: string | null;
  dotacaoPostergada: boolean;
  orgaoNome: string | null;
  orgaoCnpj: string | null;
  orgaoEndereco: string | null;
  orgaoEsfera: string | null;
  orgaoUasg: string | null;
  orgaoTelefone: string | null;
  localExecucaoServicos: string | null;
  horarioExecucaoServicos: string | null;
  prazoInicioExecucaoDias: number | null;
  marcoInicioExecucao: MarcoInicioExecucaoEnum | null;
  prazoRecebimentoProvisorioDias: number | null;
  prazoRecebimentoDefinitivoDias: number | null;
  prazoPagamentoDias: number | null;
  exigeGarantiaContratual: boolean;
  percentualGarantiaContratual: number | null;
  garantiaServicoDescricao: string | null;
  permiteSubcontratacao: boolean;
  percentualMaximoSubcontratacao: number | null;
  exigeUniforme: boolean;
  especificacaoUniforme: string | null;
  indiceReajuste: string | null;
  periodicidadeReajusteMeses: number | null;
  percentualMultaMoratoria: number | null;
  percentualMultaCompensatoria: number | null;
  prazoAssinaturaContratoDiasUteis: number | null;
  prazoValidadePropostaDias: number | null;
  intervaloMinimoLances: string | null;
  meioImpugnacaoEsclarecimento: string | null;
  status: StatusProcessoContratacaoEnum;
  criadoEm: string;
  itens: IItemProcessoContratacao[];
  artefatos: IArtefatoGerado[];
}

export interface IProcessoContratacaoForm {
  cotacaoUuid: string;
  objeto?: string | null;
  justificativaNecessidade?: string | null;
  modalidadePretendida?: ModalidadeProcessoEnum | null;
  criterioJulgamento?: CriterioJulgamentoProcessoEnum | null;
  regimeExecucao?: RegimeExecucaoProcessoEnum | null;
  prazoVigenciaMeses?: number | null;
  prazoVigenciaFundamentoLegal?: PrazoVigenciaFundamentoEnum | null;
  tipoObjetoContinuo?: boolean | null;
  orcamentoSigiloso?: boolean | null;
  registroPrecos?: boolean | null;
  tratamentoFavorecidoMeEpp?: boolean | null;
  dotacaoGestaoUnidade?: string | null;
  dotacaoFonteRecursos?: string | null;
  dotacaoProgramaTrabalho?: string | null;
  dotacaoElementoDespesa?: string | null;
  dotacaoPlanoInterno?: string | null;
  dotacaoPostergada?: boolean | null;
  orgaoNome?: string | null;
  orgaoCnpj?: string | null;
  orgaoEndereco?: string | null;
  orgaoEsfera?: string | null;
  orgaoUasg?: string | null;
  orgaoTelefone?: string | null;
  localExecucaoServicos?: string | null;
  horarioExecucaoServicos?: string | null;
  prazoInicioExecucaoDias?: number | null;
  marcoInicioExecucao?: MarcoInicioExecucaoEnum | null;
  prazoRecebimentoProvisorioDias?: number | null;
  prazoRecebimentoDefinitivoDias?: number | null;
  prazoPagamentoDias?: number | null;
  exigeGarantiaContratual?: boolean | null;
  percentualGarantiaContratual?: number | null;
  garantiaServicoDescricao?: string | null;
  permiteSubcontratacao?: boolean | null;
  percentualMaximoSubcontratacao?: number | null;
  exigeUniforme?: boolean | null;
  especificacaoUniforme?: string | null;
  indiceReajuste?: string | null;
  periodicidadeReajusteMeses?: number | null;
  percentualMultaMoratoria?: number | null;
  percentualMultaCompensatoria?: number | null;
  prazoAssinaturaContratoDiasUteis?: number | null;
  prazoValidadePropostaDias?: number | null;
  intervaloMinimoLances?: string | null;
  meioImpugnacaoEsclarecimento?: string | null;
}
[];
