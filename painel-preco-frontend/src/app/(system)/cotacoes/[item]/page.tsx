import { PageHeader } from "@/components/molecules/page-header";
import ViewItemLicitacao from "./ViewItemLicitacao";

export default async function PageItemCotacao({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div>
      <PageHeader
        title="Cotação"
        breadcrumbItems={[
          {
            label: "Cotação",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Visualizar Item" },
        ]}
      />
      <ViewItemLicitacao uuidItem={resolvedParams.item} />
    </div>
  );
}
