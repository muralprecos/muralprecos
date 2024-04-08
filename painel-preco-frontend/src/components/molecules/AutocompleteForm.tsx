'use client'

import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { IItemSelect } from '@/interfaces/types'
import { Controller, FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, UseControllerProps } from 'react-hook-form'
import { messages } from '@/utils/messages'

interface IProps<P extends FieldValues> extends UseControllerProps<P>, Omit<AutocompleteProps, "children"|"items"|"defaultItems"|"name"> {
  items: IItemSelect[]
  errors?: FieldErrors
}

function AutocompleteForm<P extends FieldValues>({
  items,
  name,
  label,
  control,
  errors,
  className="w-full",
  variant="flat",
  placeholder="Digite para buscar...",
  ...opts
} : IProps<P>) {
  
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
          defaultItems={items}
          onSelectionChange={field.onChange}
          selectedKey={field.value}
          errorMessage={isValid ? "" : errMsg}
          isInvalid={isValid ? false : true}
          listboxProps={{
            emptyContent: messages.FORM_AUTOCOMPLETE_EMPTY
          }}
          {...field}
          {...opts}
        >
          {(item) => (
            <AutocompleteItem key={item.value} className="capitalize">
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  )
}

export default AutocompleteForm;