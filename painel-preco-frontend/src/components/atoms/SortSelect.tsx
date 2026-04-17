"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/app/(system)/cotacoes/realizar-cotacao/_components/utils";

interface ISortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  triggerClassName?: string;
}

export default function SortSelect({
  value,
  onValueChange,
  triggerClassName,
}: ISortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder="Relevância (padrão)" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
