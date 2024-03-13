import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { Suspense } from "react";
import LoadingList from "@/components/molecules/LoadingList";
import { redirect,  } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import ListItemLicitacao from "@/components/organisms/ListItemLicitacao";
import Link from "next/link";
import { auth } from "auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";

export default async function PageCotacaoListagem() {

  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(session, [], CheckRolesStrategy.INCLUDES_ALL);
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? '/');
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
            
          <section className='container flex flex-col items-start justify-start'>
            <FormTitle>
              <div className="flex-auto">
                Resultado da Cotação
              </div>
              <Button color="secondary" type="button" as={Link} href="/cotacao">
                Voltar
              </Button>
            </FormTitle>
            <Divider className="my-4" />
            <FormRow className='flex flex-col items-start justify-start'>
              <Suspense fallback={<LoadingList/>}>
                <ListItemLicitacao token={accessToken} />
              </Suspense>
            </FormRow>
          </section>

          </CardBody>
        </Card>
      </div>
    </section>
  );
}