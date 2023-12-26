// app/tabs/page.tsx
"use client";

import KeyIcon from "@/components/atoms/icons/KeyIcon";
import MailIcon from "@/components/atoms/icons/MailIcon";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Input, Link } from "@nextui-org/react";
import { logIn, logOut } from '@/redux/features/auth-slice'
import { AppDispatch, useDispatch } from "@/redux/store";
import { useState } from "react";

const LoginPage: React.FC = ({
  ...opts
}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const onClickLogIn = () => {
    dispatch(logIn(username))
  }

  return (
    <section className='flex items-center justify-center flex-col w-full flex-1 -mt-8'>

          <Card className="max-w-[600px] container">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md text-primary font-semibold">Acessar Conta - Mural de Preço</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody className="gap-2">
              <Input
                autoFocus
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                placeholder="Digite seu e-mail"
                variant="bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                endContent={
                  <KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Senha"
                placeholder="Digite sua senha"
                type="password"
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  classNames={{
                    label: "text-small",
                  }}
                >
                  Lembrar-me
                </Checkbox>
                <Link color="primary" href="#" size="sm">
                  Esqueceu a senha?
                </Link>
              </div>

            </CardBody>
            <Divider/>
            <CardFooter className="flex-col">
              <div className="flex flex-1 justify-end gap-2 w-full py-2">
                <Button color="default" variant="flat">
                  Cancelar
                </Button>
                <Button color="primary" onClick={onClickLogIn}>
                  Acessar Conta
                </Button>
              </div>
            </CardFooter>
          </Card>
          

    </section>
  );
}

export default LoginPage;