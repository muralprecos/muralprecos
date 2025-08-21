import FormValidateItem from "@/app/(system)/cotacoes/validacao/components/formValidateItem";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Shield } from "lucide-react";
import ValidaItens from "@/app/(system)/cotacoes/validacao/components/validaItem";
export default function ValidarCotacao({
  params,
}: {
  params: { itens: string[] };
}) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Validação de Cotação
          </CardTitle>
          <CardDescription>
            Insira o código de validação para verificar a autenticidade da
            cotação
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormValidateItem params={params} />
          {!!params.itens && <ValidaItens itens={params.itens} />}
        </CardContent>
      </Card>
    </div>
  );
}
