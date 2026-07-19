"use client";

import {
  Controller,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseControllerProps,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface IProps<P extends FieldValues> extends UseControllerProps<P> {
  errors?: FieldErrors;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  as?: "input" | "textarea";
  icon?: React.ReactNode;
  rows?: number;
}
export default function InputForm<P extends FieldValues>({
  name,
  label,
  control,
  errors,
  placeholder,
  type = "text",
  className = "w-full",
  inputClassName,
  icon,
  as = "input",
  ...opts
}: IProps<P>) {
  const err: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined =
    errors?.[name];
  const isValid = !err;
  const errMsg = !isValid ? `${label ?? name} ${err?.message ?? ""}` : "";

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const Component = as === "textarea" ? "textarea" : "input";

          return (
            <Component
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className={cn(
                "w-full px-3 py-2 text-sm rounded-md outline-none transition-all",
                "text-foreground bg-surface-plain",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "placeholder:text-muted-foreground placeholder:text-sm placeholder:font-medium",
                isValid
                  ? "border border-input focus:ring-2 focus:ring-primary"
                  : "border border-destructive focus:ring-2 focus:ring-destructive",
                inputClassName
              )}
              {...opts}
            />
          );
        }}
      />

      {!isValid && <p className="text-xs text-destructive mt-1">{errMsg}</p>}
    </div>
  );
}
