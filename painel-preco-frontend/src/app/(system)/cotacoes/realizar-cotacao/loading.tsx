import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/molecules/page-header";
import LoadingForm from "@/components/molecules/LoadingForm";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Cotação"
        breadcrumbItems={[
          {
            label: "Cotações",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Realizar Cotação" },
        ]}
      />
      <main className="p-6">
        <LoadingForm />
      </main>
    </>
  );
}
