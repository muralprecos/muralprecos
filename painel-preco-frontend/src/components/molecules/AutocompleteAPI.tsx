'use client'

import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { IObjetoAPI } from '@/interfaces/types'
import { AsyncListData } from '@react-stately/data'

interface IProps<T extends IObjetoAPI> extends Omit<AutocompleteProps, "children"|"items"> {
  autocompleteHook: AsyncListData<T>
}

export function AutocompleteAPI<T extends IObjetoAPI>({
  autocompleteHook,
  ...opts
} : IProps<T>) {
  

  return (
    <Autocomplete
        className="w-full"
        variant="flat"
        label={opts.label}
        inputValue={autocompleteHook.filterText}
        isLoading={autocompleteHook.isLoading}
        items={autocompleteHook.items}
        placeholder="Digite para buscar..."
        onInputChange={autocompleteHook.setFilterText}
      >
        {(item) => (
          <AutocompleteItem key={item.uuid} className="capitalize">
            {item.nome}
          </AutocompleteItem>
        )}
      </Autocomplete>
  )
}

export default AutocompleteAPI;