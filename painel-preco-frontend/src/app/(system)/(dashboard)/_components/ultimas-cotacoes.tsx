import ItemCotacao from "@/components/atoms/item-cotacao";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Eye } from "lucide-react";
import Link from "next/link";
type Cotacao = {
  uuid: string;
  nome: string;
  criadoEm: string;
  status: string | null;
  valor: number | null;
};

type UltimasCotacoesProps = {
  data: Cotacao[];
};

export default function UltimasCotacoes({ data }: UltimasCotacoesProps) {
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
            data.map((cotacao) => (
              <ItemCotacao
                key={cotacao.uuid}
                uuid={cotacao.uuid}
                nome={cotacao.nome}
                criadoEm={cotacao.criadoEm}
              />
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
