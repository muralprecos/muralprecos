import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { Suspense } from "react";
import LoadingList from "@/components/molecules/LoadingList";
import { auth } from "auth";
import BackButton from "@/components/atoms/BackButton";
import Link from "next/link";
import ValidaItens from "./validaItem";
import FormValidateItem from "./formValidateItem";

export default async function PageValidacao({ params } : { params : { itens: string[] } }) {

  const session = await auth();

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card className="mx-1">
          <CardBody>
            <section className='container flex flex-col items-start justify-start'>
              <FormTitle title="Validar Cotação">
                { !!session && (
                  <Button className="force-text-transform-none" color="secondary" type="button" as={Link} href="/cotacao" >
                    Nova Cotação
                  </Button>
                ) }
                <BackButton />
              </FormTitle>
              <Divider className="my-2" />
              <FormRow className='flex flex-col items-start justify-start'>
                <FormValidateItem params={params} />
              </FormRow>
              { !!params.itens && (
                <FormRow className='flex flex-col items-start justify-start'>
                  <Divider className="my-2" />
                  <Suspense fallback={<LoadingList/>}>
                    <ValidaItens itens={params.itens} />
                  </Suspense>
                </FormRow>
              ) }
            </section>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}