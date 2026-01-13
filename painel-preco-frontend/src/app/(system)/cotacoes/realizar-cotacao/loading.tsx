import { PageHeader } from "@/components/molecules/page-header";
import LoadingForm from "@/components/atoms/LoadingForm";

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
      <LoadingForm />
    </>
  );
}
