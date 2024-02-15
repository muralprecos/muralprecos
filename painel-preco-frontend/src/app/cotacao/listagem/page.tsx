"use client";

import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { Suspense, useEffect, useState } from "react";
import LoadingList from "@/components/molecules/LoadingList";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAccessTokenClient } from "@/utils/sessionTokenAccessor";
import ListItemLicitacao from "@/components/organisms/ListItemLicitacao";

interface IPropsPageCotacaoListagem {}

const PageCotacaoListagem: React.FC<IPropsPageCotacaoListagem> = ({
  ...opts
}) => {

  const router = useRouter();
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string|null>(null);

  useEffect(() => {
    async function getToken() {
      const accessToken = await getAccessTokenClient(session);
      setToken(accessToken);
    }
    getToken();
  }, [session])

  const goSearchTab = () => {
    router.push('/cotacao');
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
              <Button color="secondary" type="button" onClick={goSearchTab}>
                Voltar
              </Button>
            </FormTitle>
            <Divider className="my-4" />
            <FormRow className='flex flex-col items-start justify-start'>
              <Suspense fallback={<LoadingList/>}>
                <ListItemLicitacao status={status} token={token} />
              </Suspense>
            </FormRow>
          </section>

          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default PageCotacaoListagem;