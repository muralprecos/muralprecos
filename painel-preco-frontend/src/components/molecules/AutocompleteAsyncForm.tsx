'use client'

import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { IObjetoAPI } from '@/interfaces/types'
import { AsyncListData } from '@react-stately/data'
import { Controller, FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, UseControllerProps } from 'react-hook-form'

interface IProps<T extends IObjetoAPI, P extends FieldValues> extends UseControllerProps<P>, Omit<AutocompleteProps, "children"|"items"|"defaultItems"|"name"> {
  autocompleteHook: AsyncListData<T>
  errors?: FieldErrors
}

function AutocompleteAsyncForm<T extends IObjetoAPI, P extends FieldValues>({
  autocompleteHook,
  name,
  label,
  control,
  errors,
  className="w-full",
  variant="flat",
  placeholder="Digite para buscar...",
  ...opts
} : IProps<T, P>) {
  
  const err: FieldError| Merge<FieldError, FieldErrorsImpl<any>> | undefined = errors ? errors[name] : undefined;
  const isValid = err == null;
  const errMsg = !isValid ? label + ' ' + err.message : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          className={className}
          variant={variant}
          placeholder={placeholder}
          label={label}
          inputValue={autocompleteHook.filterText}
          isLoading={autocompleteHook.isLoading}
          items={autocompleteHook.items}
          onInputChange={autocompleteHook.setFilterText}
          onSelectionChange={field.onChange}
          errorMessage={isValid ? "" : errMsg}
          isInvalid={isValid ? false : true}
          {...field}
          {...opts}
        >
          {(item:T) => (
            <AutocompleteItem key={item.uuid} className="capitalize">
              {item.nome}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  )
}

export default AutocompleteAsyncForm;