import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { BarChart3, Eye } from "lucide-react";
import Link from "next/link";
type Quotation = {
  uuid: string;
  nome: string;
  criadoEm: string;
  status: string | null;
  valor: number | null;
};

type LatestQuotationsProps = {
  data: Quotation[];
};

const getStatusVariant = (
  status: string | null
): "default" | "secondary" | "outline" | "destructive" => {
  if (!status) return "secondary";
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("concluída") || lowerStatus.includes("finalizada")) {
    return "default";
  }
  if (lowerStatus.includes("pendente") || lowerStatus.includes("em análise")) {
    return "outline";
  }
  if (lowerStatus.includes("cancelada")) {
    return "destructive";
  }

  return "secondary"; // Fallback
};

export default function LatestQuotations({ data }: LatestQuotationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Últimas Cotações
        </CardTitle>
        <CardDescription>Cotações criadas recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data && data.length > 0 ? (
            data.map((quotation) => (
              <div
                key={quotation.uuid}
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm line-clamp-2">
                      {quotation.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quotation.criadoEm}
                    </p>
                  </div>
                  {/* Implementacão futura */}
                  {/* <Badge
                    variant={getStatusVariant(quotation.status)}
                    className="text-xs"
                  >
                    {quotation.status || "Pendente"}
                  </Badge> */}
                </div>
                {/* Implementacão futura */}
                {/* <div className="text-right">
                  <span className="font-medium text-sm">
                    {formatCurrency(quotation.valor)}
                  </span>
                </div> */}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma cotação recente encontrada.
            </p>
          )}
        </div>
        <Link href="/cotacoes/historico">
          <Button variant="ghost" className="w-full mt-4 gap-2" size="sm">
            <Eye className="h-4 w-4" />
            Ver todas
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
