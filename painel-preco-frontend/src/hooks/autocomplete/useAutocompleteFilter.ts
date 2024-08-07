import { IAPISearchInfo, IAPISearchProps, IReturnRequestAPI, ISimpleObjetoAPI } from "@/interfaces/types";
import { useAsyncList } from "@react-stately/data";

export interface IAutocompleteListHook<T extends ISimpleObjetoAPI> {
  initialFilterText?: string | null
  initialSelectedKeys?: Iterable<string | number> | null
  minCharactersLoad?: number
  size?: number
  params?: string[]
  infos?: IAPISearchInfo[] | undefined
  getList: (info : IAPISearchInfo[]) => Promise<IReturnRequestAPI<T>|null>
  accessToken?: string|null
}

export function useAutocompleteFilter<T extends ISimpleObjetoAPI>({
  initialFilterText = '',
  initialSelectedKeys = '',
  minCharactersLoad = 3,
  size = 20,
  params = ['nome'],
  infos,
  getList
} : IAutocompleteListHook<T>) {

  const list = useAsyncList<T>({
    initialFilterText: initialFilterText || '',
    initialSelectedKeys: initialSelectedKeys || '',
    //TODO: passar parametros para o fetch, por ex: {signal}
    async load({signal, filterText}) {
      if (filterText != null && filterText.length >= minCharactersLoad) {
        let info: IAPISearchInfo[] = [];
        let doReq = true;
        params.forEach(p => {
          info.push({
            param: p,
            val: filterText || ''
          })
        });
        
        if (infos != null) {
          if (infos.length) {
            info = infos.concat(info);
          } else {
            doReq = false;
          }
        }
        const res = doReq ? await getList(info) : { content: [] };
        return {
          items: res != null ? res.content : []
        };
      }
      return {
        items: []
      }
    },
  })

  return list;
};
