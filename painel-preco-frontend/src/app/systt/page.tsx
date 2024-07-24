import { Card, CardBody } from "@nextui-org/react";
import React from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const LoginPage = (props: Props) => {

  const hasInfo = (str: string | undefined) => {
    return str && str !== "" ? "Contém valor" : "Não informado";
  }

  return (
    <section className='flex items-center justify-center flex-col flex-1 -mt-8 mx-2' style={{ width: 'calc(100% - 1em)'}}>

      <Card className="max-w-[600px] container">
        <CardBody>
          <h1>Infos:</h1>
          <h3>API_URL: {hasInfo(process.env.API_URL)}</h3>
          <h3>AUTH_SECRET: {hasInfo(process.env.AUTH_SECRET)}</h3>
          <h3>KEYCLOAK_ID: {hasInfo(process.env.KEYCLOAK_ID)}</h3>
          <h3>KEYCLOAK_ISSUER: {hasInfo(process.env.KEYCLOAK_ISSUER)}</h3>
          <h3>GET_TOKEN_URL: {hasInfo(process.env.GET_TOKEN_URL)}</h3>
          <h3>REFRESH_TOKEN_URL: {hasInfo(process.env.REFRESH_TOKEN_URL)}</h3>
          <h3>END_SESSION_URL: {hasInfo(process.env.END_SESSION_URL)}</h3>
          <h3>CHECK_SESSION_URL: {hasInfo(process.env.CHECK_SESSION_URL)}</h3>
          <h3>KEYCLOAK_SECRET: {hasInfo(process.env.KEYCLOAK_SECRET)}</h3>

        </CardBody>
      </Card>
    </section>
  );
};

export default LoginPage;