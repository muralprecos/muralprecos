import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { Suspense } from "react";
import LoadingList from "@/components/molecules/LoadingList";
import { redirect,  } from "next/navigation";
import { CheckRolesStrategy, checkAccessRoles, getAccessToken } from "@/utils/sessionTokenAccessor";
import ListItemLicitacao from "@/components/organisms/ListItemLicitacao";
import Link from "next/link";


export default async function PageCotacaoListagem() {

  const accessToken = await getAccessToken() || '';
  const hasAuthorization = await checkAccessRoles([], CheckRolesStrategy.INCLUDES_ALL);

  if (!accessToken) {
    redirect("/login");
  } else if (!hasAuthorization) {
    redirect("/unauthorized");
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