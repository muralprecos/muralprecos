import ItemLicitacao from "@/components/molecules/item-licitacao";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";

type Licitacao = {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string | null;
  valor: number | null;
};

type LatestLicitacoesProps = {
  data: Licitacao[];
};

export default function UltimasLicitacoes({ data }: LatestLicitacoesProps) {
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
            data.map((licitacao) => (
              <ItemLicitacao
                key={licitacao.uuid}
                dataAbertura={licitacao.dataAbertura}
                numero={licitacao.numero}
                objeto={licitacao.objeto}
                status={licitacao.status}
                uuid={licitacao.uuid}
                valor={licitacao.valor}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma licitação recente encontrada.
            </p>
          )}
        </div>
        <Link href="/licitacoes">
          <Button variant="ghost" className="w-full mt-4 gap-2" size="sm">
            <Eye className="h-4 w-4" />
            Ver todas
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
