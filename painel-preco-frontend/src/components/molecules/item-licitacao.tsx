"use client";

import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";

interface LicitacaoProps {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string | null;
  valor: number | null;
}

const getStatusVariant = (
  status: string | null
): "default" | "secondary" | "outline" | "destructive" => {
  if (!status) return "secondary";
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("aberta") || lowerStatus.includes("divulgada")) {
    return "default";
  }
  if (lowerStatus.includes("andamento")) {
    return "secondary";
  }
  if (lowerStatus.includes("finalizada") || lowerStatus.includes("concluída")) {
    return "outline";
  }
  if (lowerStatus.includes("cancelada") || lowerStatus.includes("falha")) {
    return "destructive";
  }

  return "secondary";
};
export default function ItemLicitacao({
  uuid,
  numero,
  objeto,
  status,
  valor,
}: LicitacaoProps) {
  return (
    <div
      key={uuid}
      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-2">
          <p className="font-medium text-sm">{numero}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{objeto}</p>
        </div>
        <Badge
          variant={getStatusVariant(status)}
          className="text-xs text-right whitespace-nowrap"
        >
          {status || "Status indef."}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{formatCurrency(valor)}</span>
      </div>
    </div>
  );
}
