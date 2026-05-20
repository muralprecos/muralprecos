import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import { CheckRolesStrategy } from "@/utils/rolesUtils";

const certidoes = [
  {
    title: "Certidões Consolidada de Pessoa Jurídica",
    url: "https://certidoes-apf.apps.tcu.gov.br",
    source: "Tribunal de Contas da União",
  },
  {
    title: "Certidão de Regularidade Fiscal de Pessoa Jurídica",
    url: "https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cnpj",
    source: "Receita Federal",
  },
  {
    title: "Consulta Regularidade do Empregador",
    url: "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf",
    source: "Caixa Econômica Federal",
  },
];

export default async function CertidoesPage() {
  const session = await auth();
  const { redirectUrl, hasAuthorization } = await checkSession(
    session,
    [],
    CheckRolesStrategy.INCLUDES_ALL,
  );

  if (!hasAuthorization) {
    redirect(redirectUrl ?? "/unauthorized");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certidões"
        subtitle="Links oficiais para emissão e consulta de certidões"
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certidoes.map((item) => (
          <Card key={item.url} className="h-full">
            <CardHeader>
              <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
              <CardDescription>{item.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Acessar certidão
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
