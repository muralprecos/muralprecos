"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/app/(system)/cotacoes/realizar-cotacao/_components/utils";

const RELEVANCIA_SENTINEL = "__relevancia__";

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
  const internalValue = value === "" ? RELEVANCIA_SENTINEL : value;

  const handleChange = (val: string) => {
    onValueChange(val === RELEVANCIA_SENTINEL ? "" : val);
  };

  return (
    <Select value={internalValue} onValueChange={handleChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder="Relevância (padrão)" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value === "" ? RELEVANCIA_SENTINEL : opt.value}
            value={opt.value === "" ? RELEVANCIA_SENTINEL : opt.value}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
