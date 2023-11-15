'use client'

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import AutocompleteField, { AutocompleteFieldHandle } from '../molecules/AutocompleteField'
import { IAPISearchProps, IItemAutocomplete, IObjetoAPI, IObjetoAPISearch, IReturnRequestAPI } from '@/interfaces/types';

interface IAutocompleteFieldAsync<T extends IObjetoAPI> {
  id: string
  autocompleteService: (props: IAPISearchProps<T>) => Promise<IReturnRequestAPI<T>>
  autocompleteMinLength?: number
  getOptionLabel?: ((option: IItemAutocomplete) => string) | undefined
  isOptionEqualToValue?: ((option: IItemAutocomplete, value: IItemAutocomplete) => boolean) | undefined
}

const AutocompleteFieldAsync: <T extends IObjetoAPI>(p: IAutocompleteFieldAsync<T>) => React.ReactElement<IAutocompleteFieldAsync<T>> = ({
  id,
  autocompleteService,

  autocompleteMinLength = 3,
  getOptionLabel = (el) => el.description,
  isOptionEqualToValue = (option, value) => {
    return option.key === value?.key
  }
}) => {

  const ref = useRef<AutocompleteFieldHandle>(null);
  const [options, setOptions] = useState<IItemAutocomplete[]>([]);
  const [val, setVal] = useState<IItemAutocomplete | null>(null);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: IItemAutocomplete | null,
    setVal: Dispatch<SetStateAction<IItemAutocomplete | null>>
  ) => {
    setVal(newValue);
  }

  return (
    <AutocompleteField
        id={id}
        options={options}
        value={val}
        onChange={(e,n) => handleChange(e,n,setVal)}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        emptyMsg={`Sem Resultados (digite ao menos ${autocompleteMinLength} caracteres)`}
        ref={ref}
        autocompleteMinLength={autocompleteMinLength}
        autocompleteService={autocompleteService}
        autocompleteChangeOption={(opts) => {setOptions(opts)}}
        autocompleteSelectOption={(opt) => {
          setVal(opt) 
          ref.current?.setValueInput(opt)
        }}
        />
  )
}

export default AutocompleteFieldAsync;