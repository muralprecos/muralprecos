"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ISimpleObjetoAPI } from "@/interfaces/types";
import { AsyncListData } from "@react-stately/data";
import {
  Controller,
  FieldErrors,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useState } from "react";
import { messages } from "@/utils/messages";

interface IProps<T extends ISimpleObjetoAPI, P extends FieldValues>
  extends UseControllerProps<P> {
  attrVal: keyof T;
  autocompleteHook: AsyncListData<T>;
  errors?: FieldErrors;
  label?: string;
  className?: string;
  placeholder?: string;
}

export function AutocompleteAsyncForm<
  T extends ISimpleObjetoAPI,
  P extends FieldValues
>({
  name,
  control,
  attrVal,
  autocompleteHook,
  errors,
  label,
  className,
  placeholder = "Digite para buscar...",
}: IProps<T, P>) {
  const [open, setOpen] = useState(false);

  const fieldError = errors?.[name];
  const isValid = !fieldError;
  const errorMessage = !isValid ? `${label ?? ""} ${fieldError?.message}` : "";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedItem = autocompleteHook.items.find(
            (i) => i[attrVal] + "" === field.value + ""
          );

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                    !isValid && "border-destructive"
                  )}
                >
                  {selectedItem?.nome || placeholder}
                  <div className="flex items-center">
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    {field.value && (
                      <a
                        onClick={(e) => {
                          e.stopPropagation(); // impede abrir o popover
                          field.onChange("");
                        }}
                        className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                        aria-label="Limpar seleção"
                      >
                        <X className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={placeholder}
                    value={autocompleteHook.filterText}
                    onValueChange={autocompleteHook.setFilterText}
                  />
                  <CommandEmpty>
                    {messages.FORM_AUTOCOMPLETE_EMPTY}
                  </CommandEmpty>
                  <CommandGroup>
                    {autocompleteHook.items.map((item) => {
                      const itemId = item[attrVal] + "";
                      return (
                        <CommandItem
                          key={itemId}
                          onSelect={() => {
                            field.onChange(itemId);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              itemId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.nome}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {!isValid && (
        <p className="text-xs text-destructive mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
