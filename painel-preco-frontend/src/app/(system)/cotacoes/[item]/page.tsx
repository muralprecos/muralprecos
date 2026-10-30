import ViewItemLicitacao from "./ViewItemLicitacao";

export default async function PageItemCotacao({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const resolvedParams = await params;

  return <ViewItemLicitacao uuidItem={resolvedParams.item} />;
}
