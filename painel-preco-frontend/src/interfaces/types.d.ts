
export interface ISimpleObjetoAPI {
  nome: string
}

export interface IObjetoAPI extends ISimpleObjetoAPI {
  uuid: string
}

export interface IObjetoAPISearch {
  uuid?: string
  nome?: string
}


export interface IFornecedor extends IObjetoAPI {
  documento: string
  porte: IPorteFornecedor
}

export interface IFornecedorSearch extends IObjetoAPISearch {
  documento?: string
}

export interface IFormaCompra extends IObjetoAPI {
  sigla: string
}

export interface IModalidadeCompra extends IObjetoAPI {
  codigo: number
}

export interface IOrgao extends IObjetoAPI {
  codigo: number
  ehsuperior?: booelan
  superior?: IOrgao
}

export interface INomeMaterial extends IObjetoAPI {
  codigo: number
}

export interface IUnidadeFederativa extends IObjetoAPI {
  sigla: string
}

export interface IMunicipio extends IObjetoAPI {
  uf: IUnidadeFederativa
}

export interface IUnidadeGestora extends IObjetoAPI {
  codigo: number
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
  nomeArquivo: string
  stringBusca: string
  hashValidacao: string
  arquivo: string
  criadoEm: string
}



type NameValue<T extends IObjetoAPI> = {
  [K in keyof T]: {
    name: K,
    value: T[K]
  }
}[keyof T]
export interface IPageableSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface IPageable {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
  sort: IPageableSort
}

export interface IReturnRequestAPI<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: IPageable
  size: number
  sort: IPageableSort
  totalElements: number
  totalPages: number
}

export interface IItemAutocomplete {
  key: React.Key
  description: string
}

export interface IItemSelect {
  value: string
  label: string
}

export interface IAPISimpleSearchPropsLogged extends IAPISimpleSearchProps {
  accessToken: string
}

export interface IAPISimpleSearchProps { 
  page?: number
  size?: number
  accessToken?: string
}

export interface IAPISearchPropsLogged extends IAPISearchProps {
  accessToken: string
}

export interface IAPISearchProps {
  host?: string
  path?: string
  page?: number
  size?: number
  info? : IAPISearchInfo[]
  filterFields?: string
  config?: RequestInit
  bodydata?: BodyInit
  contentType?: string
  acceptType?: string
  accessToken?: string
}

export interface IAPISearchInfo {
  val: string
  param: string
}

export interface IReturnRequestAPIBasic<T> {
  content: T[]
}

export interface IRetornoPesquisaItensLicitacao extends Pick<IItemLicitacao, "uuid" | "descricao" | "quantidade" | "valor" | "unidadeFornecimento">, Partial<IItemLicitacao> {
  licitacao: Pick<ILicitacao, "municipio" | "dataResultadoCompra"> & Partial<ILicitacao>
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
  uuid: string
  nome: string
  nomeArquivo: string
  stringBusca: string
  hashValidacao: string
  arquivo: string
  criadoEm: string
}

export type IResValidacaoCotacao = {
  uuid: string
  isok: boolean
  message: string
  validacao?: IValidaCotacao
}

export interface IItemLicitacao {
  uuid: string
  codigo: number
  descricao: string
  descricaoComplementar: string
  unidadeFornecimento: IUnidadeFornecimento
  quantidade: number
  valor: string
  material: INomeMaterial
  fornecedor: IFornecedor
  licitacao: ILicitacao
  links?: [{
    nome: string
    url: string
  }]
}

export interface ILicitacao {
  uuid: string
  numero: number
  unidadeGestora: IUnidadeGestora
  modalidadeCompra: IModalidadeCompra
  numeroProcesso: string
  objeto: string
  situacao: ISituacaoLicitacao
  orgao: IOrgao
  orgaoSuperior: IOrgao
  municipio: IMunicipio
  formaCompra: IFormaCompra
  esfera: IEsfera
  dataAbertura: any
  dataResultadoCompra: string
  valor: number
  anoCompra: number
  periodoCompra: string
}

export interface IOrganizacao {
  uuid: string
  nome: string
  unidade: {
    uuid: string
    nome: string
  }
}

export interface IUserInfo {
  name: string
  given_name: string
  family_name: string
  email: string
  email_verified: boolean
  organizacao: IOrganizacao
  preferred_username: string
  realm_access: {
    roles: string[] | null
  }
}

export interface IUserAuth {
  username: string
  password: string
}

export interface IUserRequest {
  userInfo: IUserInfo | null
  userToken: IUserKeyCloak | null
}

export interface IUserKeyCloak {
  access_token: string,
  expires_in: number,
  refresh_expires_in: number,
  refresh_token: number,
  token_type: "Bearer",
  session_state: string,
  scope: string
}

export interface IUser {
  isAuth: boolean
  error: string | null
  user: IUserRequest | null
}

export interface ICartItem {
  user: string
  item: IRetornoPesquisaItensLicitacao
}

export interface ICart {
  [user: string] : IRetornoPesquisaItensLicitacao[]
}

//type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (props?: Merge<DOMAttributes, P>, ref?: React.Ref<any>) => R & React.RefAttributes<any>;
