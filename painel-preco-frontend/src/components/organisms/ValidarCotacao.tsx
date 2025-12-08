import FormValidateItem from "@/app/(system)/cotacoes/validar-cotacao/components/formValidateItem";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Shield } from "lucide-react";
import ValidaItens from "@/app/(system)/cotacoes/validar-cotacao/components/validaItem";
export default function ValidarCotacao({
  params,
}: {
  params: { itens: string[] };
}) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            Validação de Cotação
          </CardTitle>
          <CardDescription>
            Insira o código de validação para verificar a autenticidade da
            cotação
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormValidateItem
            params={params}
            basePath="/cotacoes/validar-cotacao/"
          />
          {!!params.itens && <ValidaItens itens={params.itens} />}
        </CardContent>
      </Card>
    </div>
  );
}
