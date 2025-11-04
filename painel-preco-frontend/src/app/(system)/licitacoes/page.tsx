import { PageHeader } from "@/components/molecules/page-header";
import ViewLicitacoes from "./ViewHistoricoLicitacoes";

export default async function PageHistoricoCotacao() {
  return (
    <div>
      <PageHeader
        title="Licitações"
        subtitle="Licitações realizadas anteriormente"
      />

      <ViewLicitacoes />
    </div>
  );
}
