
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

export interface IAPISearchProps {
  path?: string
  page?: number
  size?: number
  info? : IAPISearchInfo[]
  filterFields?: string
  config?: RequestInit
}

export interface IAPISearchInfo {
  val: string
  param: string
}

export interface IReturnRequestAPIBasic<T> {
  content: T[]
}

export interface IRetornoPesquisaItensLicitacao {
  uuid: string
  descricao: string
  quantidade: number
  valor: number
  licitacao: {
    municipio: {
      uf: {
        nome: string
      }
    }
    dataResultadoCompra: string
  }
}

export interface IItemLicitacao {
  uuid: string
  codigo: number
  descricao: string
  descricaoComplementar: string
  unidadeFornecimento: IUnidadeFornecimento
  quantidade: number
  valor: number
  material: INomeMaterial
  fornecedor: IFornecedor
  licitacao: ILicitacao
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


//type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (props?: Merge<DOMAttributes, P>, ref?: React.Ref<any>) => R & React.RefAttributes<any>;
