'use client'

import { Select, SelectItem, SelectProps, Selection } from '@nextui-org/react'
import { IItemSelect } from '@/interfaces/types'
import { Controller, FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, UseControllerProps } from 'react-hook-form'

interface IProps<P extends FieldValues> extends UseControllerProps<P>, Omit<SelectProps, "children"|"items"|"defaultItems"|"name"> {
  items: IItemSelect[]
  errors?: FieldErrors
}

function SelectForm<P extends FieldValues>({
  items,
  name,
  label,
  control,
  errors,
  className="w-full",
  ...opts
} : IProps<P>) {
  
  const err: FieldError| Merge<FieldError, FieldErrorsImpl<any>> | undefined = errors ? errors[name] : undefined;
  const isValid = err == null;
  const errMsg = !isValid ? label + ' ' + err.message : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field } }) => {
        return <Select
          {...field}
          ref={ref}
          label={label}
          items={items}
          errorMessage={isValid ? "" : errMsg}
          isInvalid={isValid ? false : true}
          selectedKeys={field.value ? [field.value] : []}
          {...opts}>
          {items.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </Select>
      }}
    />
  )
}

export default SelectForm;