"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface LicitacaoProps {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura?: string | null;
  status: string | null;
  valor: number | null;

  showIcon?: boolean;
}

const getStatusVariant = (
  status: string | null
): "default" | "secondary" | "outline" | "destructive" => {
  if (!status) return "secondary";
  const lower = status.toLowerCase();

  if (lower.includes("aberta") || lower.includes("divulgada")) return "default";
  if (lower.includes("andamento")) return "secondary";
  if (lower.includes("finalizada") || lower.includes("concluido"))
    return "outline";
  if (lower.includes("cancelada") || lower.includes("falha"))
    return "destructive";

  return "secondary";
};

export default function ItemLicitacao({
  uuid,
  numero,
  objeto,
  status,
  dataAbertura,
  valor,
  showIcon = false,
}: LicitacaoProps) {
  return (
    <Card
      key={uuid}
      className={cn(
        "cursor-pointer transition-all select-none border rounded-xl",
        "hover:bg-accent/30 hover:shadow-sm active:scale-[0.99]"
      )}
    >
      <CardContent className="p-4 flex items-start gap-4">
        {showIcon && (
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        )}

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground leading-tight">
                {numero}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {objeto}
              </p>
            </div>

            <Badge
              variant={getStatusVariant(status)}
              className="text-[10px] px-2 py-0.5 whitespace-nowrap"
            >
              {status ?? "Indefinido"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {" "}
              {dataAbertura ? formatDate(dataAbertura) : "Data inválida"}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(valor)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
