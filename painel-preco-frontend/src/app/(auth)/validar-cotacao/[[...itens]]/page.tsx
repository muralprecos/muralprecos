import FormValidateItem from "@/app/(system)/cotacoes/validar-cotacao/components/formValidateItem";
import ValidaItens from "@/app/(system)/cotacoes/validar-cotacao/components/validaItem";
import { PageHeader } from "@/components/molecules/page-header";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { MailboxIcon, Shield } from "lucide-react";

interface PageProps {
  params: { itens?: string[] };
}

export default function ValidarCotacaoPublica({ params }: PageProps) {
  const itens = params.itens || [];

  return (
    <div className="space-y-6">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <PageHeader
            title="Validação Pública de Cotações"
            subtitle="Consulte a autenticidade de cotações emitidas pela TT Sistemas."
            backButton={true}
          />
        </div>
      </header>

      <div className="flex items-center justify-center p-4 space-y-3 text-left max-w-2xl mx-auto">
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              Validação Pública
            </CardTitle>
            <CardDescription>
              Consulta pública de autenticidade de cotações.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormValidateItem params={{ itens }} basePath="/validar-cotacao" />

            {itens.length > 0 && (
              <div className="mt-6">
                <ValidaItens itens={itens} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TT Sistemas. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
