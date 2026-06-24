"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface IItem {
  label: string;
  value: string;
}

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  items: IItem[];
  placeholder?: string;
  className?: string;
  errors?: Record<string, any>;
  disableSorting?: boolean;
}

export default function AutocompleteForm<T extends FieldValues>({
  control,
  name,
  label,
  items,
  placeholder = "Digite para buscar...",
  className,
  errors,
  disableSorting,
}: Props<T>) {
  const error = errors?.[name]?.message;
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedItem = items.find((item) => item.value === field.value);

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(!open)}
                >
                  {selectedItem?.label || placeholder}
                  <div className="flex items-center">
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    {field.value && (
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
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
                <Command>
                  <CommandInput placeholder={placeholder} className="h-9" />
                  <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                  <CommandGroup>
                    {(() => {
                      const sortedItems = disableSorting 
                        ? items 
                        : [...items].sort((a, b) => 
                            a.label.trim().localeCompare(b.label.trim())
                          );
                      return sortedItems.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label}
                        onSelect={() => {
                          field.onChange(item.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                      ));
                    })()}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.toString()}</p>}
    </div>
  );
}
