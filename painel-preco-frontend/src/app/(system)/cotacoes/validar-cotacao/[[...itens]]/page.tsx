import { PageHeader } from "@/components/molecules/page-header";
import ValidarCotacao from "@/components/organisms/ValidarCotacao";

export default async function PageValidacao({
  params,
}: {
  params: Promise<{ itens: string[] }>;
}) {
  const resolvedParams = await params;

  return (
    <div>
      <ValidarCotacao params={resolvedParams} />
    </div>
  );
}
