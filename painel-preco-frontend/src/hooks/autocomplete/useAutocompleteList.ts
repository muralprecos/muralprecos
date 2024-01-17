import { IAPISearchProps, IObjetoAPI, IReturnRequestAPI } from "@/interfaces/types";
import { useAsyncList } from "@react-stately/data";
import React from "react";

interface IAutocompleteListHook<T extends IObjetoAPI> {
  fetchDelay?: number;
  size?: number;
  minCharactersLoad?: number;
  initWithData?: boolean;
  getList: (props: IAPISearchProps) => Promise<IReturnRequestAPI<T>>;
}

export function useAutocompleteList<T extends IObjetoAPI>({
  fetchDelay = 0, 
  size = 20,
  minCharactersLoad = 0,
  initWithData = false,
  getList
} : IAutocompleteListHook<T>) {

  const [filterText, setFilterText] = React.useState<string>('');
  const [items, setItems] = React.useState<T[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<string | number | null | undefined>();
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState<number>(0);

  const loadData = async (currentPage: number) => {
    const controller = new AbortController();
    const {signal} = controller;

    try {
      setIsLoading(true);

      if (page >= 0) {
        // Delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      //TODO: passar parametros para o fetch, por ex: {signal}
      const data = await getList({
        page: currentPage,
        size
      });

      setHasMore(!data.last);
      // Append new results to existing ones
      setItems((prevItems) => [...prevItems, ...data.content]);

    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //initialize
  React.useEffect(() => {
    if (initWithData)
      loadData(page);
  });

  React.useEffect(() => {
    console.log(filterText)
  }, [filterText]);


  const onLoadMore = () => {
    const newPage = page+1;
    setPage(newPage);
    loadData(newPage);
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
    filterText,
    setFilterText,
    selectedItem,
    setSelectedItem
  };
};
