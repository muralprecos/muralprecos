import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import ListItemLicitacao from "@/app/(system)/cotacoes/listagem/ListItemLicitacao";
import { PageHeader } from "@/components/molecules/page-header";

export default function PageCotacaoListagem() {
  return (
    <div>
      <PageHeader
        breadcrumbItems={[
          {
            label: "Cotação",
            href: "/cotacoes/realizar-cotacao",
            hiddenOnMobile: true,
          },
          { label: "Listagem de Itens" },
        ]}
      />
      <ListItemLicitacao />
    </div>
  );
}
