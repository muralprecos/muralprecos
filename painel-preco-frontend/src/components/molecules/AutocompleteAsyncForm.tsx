'use client'

import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { ISimpleObjetoAPI } from '@/interfaces/types'
import { AsyncListData } from '@react-stately/data'
import { Controller, FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, UseControllerProps } from 'react-hook-form'
import { messages } from '@/utils/messages'

type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V? P: never]: any
}

interface IProps<T extends ISimpleObjetoAPI, P extends FieldValues> extends UseControllerProps<P>, Omit<AutocompleteProps, "children"|"items"|"defaultItems"|"name"> {
  attrVal: keyof T
  autocompleteHook: AsyncListData<T>
  errors?: FieldErrors
}

function AutocompleteAsyncForm<T extends ISimpleObjetoAPI, P extends FieldValues>({
  autocompleteHook,
  attrVal,
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
          listboxProps={{
            emptyContent: messages.FORM_AUTOCOMPLETE_EMPTY
          }}
          {...field}
          {...opts}
        >
          {(item:T) => (
            <AutocompleteItem key={item[attrVal]+''} className="capitalize">
              {item.nome}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  )
}

export default AutocompleteAsyncForm;