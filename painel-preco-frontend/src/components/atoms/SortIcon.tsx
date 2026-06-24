import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortIconProps {
  direction?: "asc" | "desc" | null;
  className?: string;
}

export function SortIcon({ direction, className }: SortIconProps) {
  if (direction === "asc") {
    return <ArrowDown className={cn("inline ml-1 h-3 w-3", className)} />;
  }
  if (direction === "desc") {
    return <ArrowUp className={cn("inline ml-1 h-3 w-3", className)} />;
  }
  return <ArrowUpDown className={cn("inline ml-1 h-3 w-3 text-muted-foreground", className)} />;
}
