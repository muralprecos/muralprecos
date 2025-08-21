import { auth } from "@/lib/auth";
import CartPage from "./ViewCart";
import { PageHeader } from "@/components/molecules/page-header";

export default async function PageCarrinho() {
  const session = await auth();

  return (
    <div>
      <PageHeader
        title="Carrinho"
        subtitle="Listagem de itens selecionados para a cotação"
      />
      <CartPage session={session} />
    </div>
  );
}
