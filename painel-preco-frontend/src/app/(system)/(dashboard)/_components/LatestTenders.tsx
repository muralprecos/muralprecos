import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { Eye, FileText } from "lucide-react";

type Tender = {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string | null;
  valor: number | null;
};

type LatestTendersProps = {
  data: Tender[];
};

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

export default function LatestTenders({ data }: LatestTendersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Últimas Licitações
        </CardTitle>
        <CardDescription>Licitações abertas recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data && data.length > 0 ? (
            data.map((tender) => (
              <div
                key={tender.uuid}
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm">{tender.numero}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {tender.objeto}
                    </p>
                  </div>
                  <Badge
                    variant={getStatusVariant(tender.status)}
                    className="text-xs text-right whitespace-nowrap"
                  >
                    {tender.status || "Status indef."}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(tender.dataAbertura)}</span>
                  <span className="font-medium">
                    {formatCurrency(tender.valor)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma licitação recente encontrada.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
