'use client'

import { Input, InputProps } from '@nextui-org/react'
import { IItemSelect } from '@/interfaces/types'
import { Controller, FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, UseControllerProps } from 'react-hook-form'

interface IProps<P extends FieldValues> extends UseControllerProps<P>, Omit<InputProps, "name"|"defaultValue"> {
  errors?: FieldErrors
}

function InputForm<P extends FieldValues>({
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
        return <Input
            {...field}
            ref={ref}
            label={label}
            errorMessage={isValid ? "" : errMsg}
            isInvalid={isValid ? false : true}
            selectedKeys={field.value ? [field.value] : []}
            {...opts}
          />
      }}
    />
  )
}

export default InputForm;