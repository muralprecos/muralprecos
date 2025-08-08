import { auth } from "@/lib/auth";
import CartPage from "./ViewCart";
import { PageHeader } from "@/components/molecules/page-header";

export default async function PageCarrinho() {
  const session = await auth();

  return (
    <div>
      <PageHeader
        breadcrumbItems={[
          {
            label: "Cotações",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Carrinho" },
        ]}
      />
      <CartPage session={session} />
    </div>
  );
}
