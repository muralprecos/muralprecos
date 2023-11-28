
interface IObjetoAPI {
  uuid: string
  nome: string
}

interface IObjetoAPISearch {
  uuid?: string
  nome?: string
}


interface IFornecedor extends IObjetoAPI {
  documento: string
  porte: string
}

interface IFornecedorSearch extends IObjetoAPISearch {
  documento?: string
}

interface IFormaCompra extends IObjetoAPI {
  sigla: string
}

interface IModalidadeCompra extends IObjetoAPI {
  codigo: number
}

interface IUnidadeFederativa extends IObjetoAPI {
  sigla: string
}

interface IOrgao extends IObjetoAPI {
  codigo: number
  ehsuperior?: booelan
}

interface IEsfera extends IObjetoAPI {}

interface IPorteFornecedor extends IObjetoAPI {}

interface IUnidadeGestora extends IObjetoAPI {}

interface ISituacaoLicitacao extends IObjetoAPI {}


interface IPeriodoCompra extends IObjetoAPI {}


type NameValue<T extends IObjetoAPI> = {
  [K in keyof T]: {
    name: K,
    value: T[K]
  }
}[keyof T]


interface IPageableSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface IPageable {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
  sort: IPageableSort
}

interface IReturnRequestAPI<T extends IObjetoAPI> {
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

interface IItemAutocomplete {
  key: React.Key
  description: string
}

interface IItemSelect {
  value: string
  label: string
}




interface IAPISearchProps<T extends IObjetoAPI> {
  path?: string
  page?: number
  size?: number
  info? : IAPISearchInfo[] | []
}

interface IAPISearchInfo {
  val: string
  param: string
}


//type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (props?: Merge<DOMAttributes, P>, ref?: React.Ref<any>) => R & React.RefAttributes<any>;

export { NameValue, IObjetoAPI, IPeriodoCompra, IFornecedor, IFormaCompra, IModalidadeCompra, IEsfera, IPageableSort, IPageable, IReturnRequestAPI, IItemAutocomplete, IItemSelect, IPorteFornecedor, IAPISearchProps,IObjetoAPISearch, IFornecedorSearch, IUnidadeFederativa, IUnidadeGestora, IOrgao, ISituacaoLicitacao, IAPISearchInfo };