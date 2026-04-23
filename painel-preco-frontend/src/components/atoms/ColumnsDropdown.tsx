"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface IColumnOption {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

interface IColumnsDropdownProps {
  columns: IColumnOption[];
  /** Se true, o menu fecha ao selecionar um item. Se false, permanece aberto para múltiplas seleções. Padrão: false */
  closeOnSelect?: boolean;
}

export default function ColumnsDropdown({
  columns,
  closeOnSelect = false,
}: IColumnsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.label}
            checked={col.checked}
            onCheckedChange={col.onCheckedChange}
            onSelect={closeOnSelect ? undefined : (e) => e.preventDefault()}
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
