import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { Suspense } from "react";
import LoadingList from "@/components/molecules/LoadingList";
import { redirect,  } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import { auth } from "auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import ViewHistoricoCotacao from "./pageClient";
import BackButton from "@/components/atoms/BackButton";
import Link from "next/link";

export default async function PageHistoricoCotacao() {

  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(session, [], CheckRolesStrategy.INCLUDES_ALL);
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? '/');
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card className="mx-1">
          <CardBody>
            
          <section className='container flex flex-col items-start justify-start'>
            <FormTitle title="Histórico de Cotações">
              <Button className="force-text-transform-none" color="secondary" type="button" as={Link} href="/cotacao" >
                Nova Cotação
              </Button>
              <BackButton/>
            </FormTitle>
            <Divider className="my-4" />
            <FormRow className='flex flex-col items-start justify-start'>
              <Suspense fallback={<LoadingList/>}>
                <ViewHistoricoCotacao />
              </Suspense>
            </FormRow>
          </section>

          </CardBody>
        </Card>
      </div>
    </section>
  );
}