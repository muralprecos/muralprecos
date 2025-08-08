import ViewHistoricoCotacao from "./ViewHistoricoCotacao";
import { PageHeader } from "@/components/molecules/page-header";

export default async function PageHistoricoCotacao() {
  return (
    <div>
      <PageHeader
        breadcrumbItems={[
          {
            label: "Cotações",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Histórico" },
        ]}
      />

      <ViewHistoricoCotacao />
    </div>
  );
}
