import { auth } from "@/lib/auth";
import { getUserBySession } from "@/utils/sessionTokenAccessor";
import { PageHeader } from "@/components/molecules/page-header";
import { FormEditarPerfil } from "./formEditarPerfil";

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
