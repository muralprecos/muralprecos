import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MaskType = "cnpj" | "cpf" | "phone";

const masks: Record<MaskType, (value: string) => string> = {
  cnpj: (v) => {
    const d = v.replace(/\D/g, "").slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  },
  cpf: (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  },
  phone: (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) {
      return d
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  },
};

interface MaskedInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  mask: MaskType;
  onChange?: (raw: string, formatted: string) => void;
}

export const MaskedInput = React.forwardRef<
  HTMLInputElement,
  MaskedInputProps
>(({ mask, onChange, className, value, defaultValue, ...props }, ref) => {
  const applyMask = masks[mask];

  const format = (val: string) => applyMask(val ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = format(e.target.value);
    const raw = formatted.replace(/\D/g, "");
    onChange?.(raw, formatted);
    e.target.value = formatted;
  };

  const formattedValue =
    value !== undefined ? format(String(value)) : undefined;
  const formattedDefault =
    defaultValue !== undefined ? format(String(defaultValue)) : undefined;

  return (
    <Input
      {...props}
      ref={ref}
      className={cn(className)}
      value={formattedValue}
      defaultValue={formattedDefault}
      onChange={handleChange}
    />
  );
});

MaskedInput.displayName = "MaskedInput";
