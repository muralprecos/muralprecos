import { Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { auth } from "auth";
import BackButton from "@/components/atoms/BackButton";
import FormEditarPerfil from "./formEditarPerfil";
import { getUserBySession } from "@/utils/sessionTokenAccessor";
import { redirect } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import { checkSession } from "@/utils/sessionCheckerServerUtils";

export default async function PageValidacao({ params } : { params : { itens: string[] } }) {

  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(session, [], CheckRolesStrategy.INCLUDES_ALL);
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? '/');
  }
  const user = getUserBySession(session);

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card className="mx-1">
          <CardBody>
            <section className='container flex flex-col items-start justify-start'>
              <FormTitle title="Editar Perfil">
                <BackButton />
              </FormTitle>
              <Divider className="my-2" />
              <FormRow className='flex flex-col items-start justify-start'>
                { user && (
                  <FormEditarPerfil usuario={user} />
                )}
              </FormRow>
            </section>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}