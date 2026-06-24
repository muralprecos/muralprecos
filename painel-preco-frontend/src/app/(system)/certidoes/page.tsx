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

const modelos = [
  {
    title: "Modelos de Licitações e Contratos",
    url: "https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos",
    source: "Advocacia-Geral da União",
    buttonName: "Acessar Modelos"
  },
];

const certidoes = [
  {
    title: "Certidões Consolidada de Pessoa Jurídica",
    url: "https://certidoes-apf.apps.tcu.gov.br",
    source: "Tribunal de Contas da União",
    buttonName: "Acessar Certidões"
  },
  {
    title: "Certidão de Regularidade Fiscal de Pessoa Jurídica",
    url: "https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cnpj",
    source: "Receita Federal",
    buttonName: "Acessar Certidão"
  },
  {
    title: "Consulta Regularidade do Empregador",
    url: "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf  ",
    source: "Caixa Econômica Federal",
    buttonName: "Acessar Certidão"
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
    <div className="space-y-8">
      <PageHeader
        title="Modelos e Certidões"
        subtitle="Modelos de documentos e links oficiais para emissão e consulta de certidões"
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Certidões</h2>
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
                  {item.buttonName}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Modelos de Documentos</h2>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modelos.map((item) => (
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
                  {item.buttonName}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

    </div>
  );
}
