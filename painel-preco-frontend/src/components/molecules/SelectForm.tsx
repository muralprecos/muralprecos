import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface IItemSelect {
  label: string;
  value: string;
}

interface Props<P extends FieldValues> extends UseControllerProps<P> {
  items: IItemSelect[];
  label: string;
  errors?: Record<string, any>;
  className?: string;
  disableSorting?: boolean;
}

export default function SelectForm<P extends FieldValues>({
  name,
  control,
  label,
  items,
  errors,
  className,
  disableSorting,
}: Props<P>) {
  const error = errors?.[name]?.message;

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const sortedItems = disableSorting 
                  ? items 
                  : [...items].sort((a, b) => 
                      a.label.trim().localeCompare(b.label.trim())
                    );
                return sortedItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
                ));
              })()}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.toString()}</p>}
    </div>
  );
}
