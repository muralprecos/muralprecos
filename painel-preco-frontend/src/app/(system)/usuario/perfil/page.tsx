import { auth } from "@/lib/auth";
import FormEditarPerfil from "./formEditarPerfil";
import { getUserBySession } from "@/utils/sessionTokenAccessor";
import { PageHeader } from "@/components/molecules/page-header";

export default async function PageValidacao() {
  const session = await auth();
  const user = getUserBySession(session);
  return (
    <div>
      <PageHeader title="Editar Perfil" subtitle="" />
      {user && <FormEditarPerfil usuario={user} />}
    </div>
  );
}
