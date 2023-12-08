import { IAPISearchInfo, IAPISearchProps, IObjetoAPI, IReturnRequestAPI } from "@/interfaces/types";
import { useAsyncList } from "@react-stately/data";

export interface IAutocompleteListHook<T extends IObjetoAPI> {
  minCharactersLoad?: number;
  size?: number;
  searchParams?: string[];
  getList: (props: IAPISearchProps<T>) => Promise<IReturnRequestAPI<T>>;
}

export function useAutocompleteFilter<T extends IObjetoAPI>({
  minCharactersLoad = 3,
  size = 20,
  searchParams = ['nome'],
  getList
} : IAutocompleteListHook<T>) {

  const list = useAsyncList<T>({
    //TODO: passar parametros para o fetch, por ex: {signal}
    async load({signal, filterText}) {
      if (filterText != null && filterText.length >= minCharactersLoad) {
        let info: IAPISearchInfo[] = [];
        searchParams.forEach(p => {
          info.push({
            param: p,
            val: filterText || ''
          })
        })

        const res = await getList({size, info});

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
