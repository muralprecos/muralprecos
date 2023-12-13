import { IAPISearchInfo, IAPISearchProps, IObjetoAPI, IReturnRequestAPI } from "@/interfaces/types";
import { useAsyncList } from "@react-stately/data";

export interface IAutocompleteListHook<T extends IObjetoAPI> {
  minCharactersLoad?: number;
  size?: number;
  searchParams?: string[];
  infos?: IAPISearchInfo[] | undefined;
  getList: (props: IAPISearchProps<T>) => Promise<IReturnRequestAPI<T>>;
}

export function useAutocompleteFilter<T extends IObjetoAPI>({
  minCharactersLoad = 3,
  size = 20,
  searchParams = ['nome'],
  infos,
  getList
} : IAutocompleteListHook<T>) {

  const list = useAsyncList<T>({
    //TODO: passar parametros para o fetch, por ex: {signal}
    async load({signal, filterText}) {
      if (filterText != null && filterText.length >= minCharactersLoad) {
        let info: IAPISearchInfo[] = [];
        let doReq = true;
        searchParams.forEach(p => {
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
        
        const res = doReq ? await getList({size, info}) : { content: [] };

        return {
          items: res.content || []
        };
      }
      return {
        items: []
      }
    },
  })

  return list;
};
