"use client";

import KeyIcon from "@/components/atoms/icons/KeyIcon";
import MailIcon from "@/components/atoms/icons/MailIcon";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Input, Link } from "@nextui-org/react";
import { logIn, logOut } from '@/redux/features/auth-slice'
import { useAppSelector, useDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { redirect, useRouter } from 'next/navigation'
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";
import yupStrings from "@/utils/yupStrings";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "@/components/molecules/InputForm";

const schema = yup.object({
  login: yup.string().required(yupStrings.required),
  password: yup.string().required(yupStrings.required)
});
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  login: '',
  password: ''
}

const LoginPage: React.FC = ({
  ...opts
}) => {

  const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);

  const router = useRouter();
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm
  });

  useEffect(() => {
    setIsLogged(isAuth);
    if (isAuth) {
      redirect('/')
    }
  }, [isAuth]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    dispatch(logIn(data.login));
    router.push('/');
  }

  const onSubmitError: SubmitErrorHandler<FormData> = (data) => console.log(data);

  if (isLogged) return <div>Redirecionando...</div>

  return (
    <section className='flex items-center justify-center flex-col w-full flex-1 -mt-8'>

          <Card className="max-w-[600px] container">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md text-primary font-semibold">Acessar Conta - Mural de Preço</p>
              </div>
            </CardHeader>
            <Divider/>
            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
              <CardBody className="gap-2">
                <InputForm
                  name="login"
                  label="E-mail"
                  autoFocus
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  variant="bordered"
                  control={control}
                  errors={errors}
                  />
                
                <InputForm
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  type="password"
                  endContent={
                    <KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  variant="bordered"
                  control={control}
                  errors={errors}
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
                    Criar Conta
                  </Button>
                  <Button color="primary" type="submit">
                    Acessar Conta
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
          

    </section>
  );
}

export default LoginPage;