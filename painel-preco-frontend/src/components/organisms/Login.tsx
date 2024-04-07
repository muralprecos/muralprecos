"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";
import yupStrings from "@/utils/yupStrings";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "@/components/molecules/InputForm";
import LoadingPage from "@/components/molecules/LoadingPage";
import SimpleInformationPage from "@/components/molecules/SimpleInformationPage";
import { useSnackbar } from "notistack";
import { addSnackError, addSnackSuccess } from "@/utils/snackbarUtils";
import { messages } from "@/utils/messages";
import { INITIAL_PAGE_LOGGED } from "@/utils/routesUtils";
import { useEffect, useState } from "react";

import { loginAction } from "@/app/action/loginActions";
import { useSession } from "next-auth/react";
import UserIdIcon from "../atoms/icons/UserIdIcon";
import LoadingCircleIcon from "../atoms/icons/LoadingCircleIcon";
import EyeIcon from "../atoms/icons/EyeIcon";
import EyeClosedIcon from "../atoms/icons/EyeClosedIcon";
import IconTheme from "../atoms/IconTheme";

const schema = yup.object({
  login: yup.string().required(yupStrings.required),
  password: yup.string().required(yupStrings.required)
});
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  login: '',
  password: ''
}

type Props = {
  className?: string;
  callbackUrl?: string;
  error?: string;
};

const Login = (props: Props) => {

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { data: session, status } = useSession();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm
  });

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    try {
      setDoingRequest(true);
      const res = await loginAction({
        username: data.login,
        password: data.password,
        redirect: props.callbackUrl || INITIAL_PAGE_LOGGED
      });
      if (res?.error) {
        setDoingRequest(false);
        addSnackError(enqueueSnackbar,res?.error);
      } else {
        addSnackSuccess(enqueueSnackbar,messages.LOGIN_SUCCESS);
      }
    } catch (e) {
      setDoingRequest(false);
      if (e instanceof Error && e.stack?.indexOf('CredentialsSignin') != -1) {
        addSnackError(enqueueSnackbar, messages.LOGIN_WRONG);
      } else {
        addSnackError(enqueueSnackbar, messages.LOGIN_ERROR);
      }
    }
  }

  const onSubmitError: SubmitErrorHandler<FormData> = (data) => {
    addSnackError(enqueueSnackbar, messages.LOGIN_ERROR);
  }

  useEffect(() => {
    if (status == "authenticated") {
      router.push(INITIAL_PAGE_LOGGED);
    }
  }, [router, status, session]);

  useEffect(() => {
    if (!!props.error) {
      addSnackError(enqueueSnackbar, props.error);
    }
  }, [props.error, enqueueSnackbar]);

  const handleShowPass = () => {
    setShowPass((prev) => {
      return !prev;
    })
  }


  if (status == "authenticated") {
    return <SimpleInformationPage title={messages.PAGE_REDIRECT} />
  }
  if (status == "loading") return <LoadingPage/>

  return (
    <section className='flex items-center justify-center flex-col flex-1 -mt-8 mx-2' style={{ width: 'calc(100% - 1em)'}}>

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
                  label="Usuário"
                  autoFocus
                  endContent={
                    <Button className="p-0" disabled={true} variant="light" isIconOnly={true}>
                      <IconTheme IconElement={UserIdIcon}/>
                      {/* <UserIdIcon 
                        classNamesArrCircle={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                        classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                        /> */}
                    </Button>
                  }
                  variant="bordered"
                  control={control}
                  errors={errors}
                  />
                
                <InputForm
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  type={showPass ? "text" : "password"}
                  endContent={
                    <Button className="p-0" variant="light" isIconOnly={true} onPressEnd={handleShowPass}>
                      {
                        !showPass ?
                        <IconTheme IconElement={EyeClosedIcon} isCursorPointer={true}/> :
                        <IconTheme IconElement={EyeIcon} isCursorPointer={true}/>
                      }
                    </Button>                    
                  }
                  variant="bordered"
                  control={control}
                  errors={errors}
                  />
                
                <div className="flex py-2 px-1 justify-between">
                  {/* <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Lembrar-me
                  </Checkbox> */}
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
                  <Button color="primary" type="submit" isDisabled={doingRequest}>
                    { doingRequest ? <><LoadingCircleIcon />Acessando Conta...</> : 'Acessar Conta' }
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
          

    </section>
  );
}

export default Login;