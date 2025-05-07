"use client";

import FormRow from "@/components/atoms/FormRow";
import FormTitle from "@/components/atoms/FormTitle";
import LoadingCircleIcon from "@/components/atoms/icons/LoadingCircleIcon";
import InputForm from "@/components/molecules/InputForm";
import { apiClientPostUserUpdate } from "@/hooks/apiclient";
import { IUserInfo } from "@/interfaces/types";
import { messages } from "@/utils/messages";
import { addSnackError, addSnackSuccess } from "@/utils/snackbarUtils";
import yupStrings from "@/utils/yupStrings";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup.string().required(yupStrings.required), // given_name:
  lastName: yup.string().required(yupStrings.required), //family_name
  email: yup.string().required(yupStrings.required),
  password: yup.string(),
  passwordConfirm: yup.string()
});
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: ''
}

export interface IPageValidacaoClient {
  usuario: IUserInfo
}

const FormEditarPerfil: React.FC<IPageValidacaoClient> = ({usuario}) => {

  const router = useRouter();
  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { update } = useSession();

  if (usuario != null) {
    initialForm.firstName = usuario.given_name;
    initialForm.lastName = usuario.family_name;
    initialForm.email = usuario.email;
    initialForm.password = '';
    initialForm.passwordConfirm = '';
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm
  });

  useEffect(() => {
    if (initialForm) {
      reset(initialForm);
    }
  }, [reset]);

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    setDoingRequest(true);
    e?.preventDefault();
    try {

      const { firstName, lastName, email, password, passwordConfirm } = data;
      let newPassword : string | undefined = '';
      if (password != '' && password != passwordConfirm) {
        addSnackError(enqueueSnackbar, messages.FORM_PASSWORD_DONT_MATCH);
        setDoingRequest(false);
        return;
      }
      newPassword = password;

      const res = await apiClientPostUserUpdate({
        firstName, lastName, email, newPassword
      });

      if (res.success) {
        addSnackSuccess(enqueueSnackbar, messages.REQUEST_SUCCESS);
        await update({firstName, lastName, email});
        router.push('/');
      } else {
        addSnackError(enqueueSnackbar, res.error || messages.REQUEST_ERROR);
      }
      
      setDoingRequest(false);
    }
    catch (e) {
      setDoingRequest(false);
    }
  }

  const onSubmitError: SubmitErrorHandler<FormData> = (data) => {
    addSnackError(enqueueSnackbar, messages.REQUEST_ERROR);
  }
  

  return (
    <form className='container flex flex-col items-start justify-start' onSubmit={handleSubmit(onSubmit, onSubmitError)}>
      <FormRow className="pb-1 pt-2 flex-col">
        <FormTitle addClassName="text-medium" title="Dados Pessoais" as="h2" />
      </FormRow>
      <FormRow className="" gap={4}>
        <InputForm
          name="firstName"
          label="Primeiro Nome"
          control={control}
          errors={errors}
          />

        <InputForm
          name="lastName"
          label="Último Nome"
          control={control}
          errors={errors}
          />
      </FormRow>
      <FormRow className="" gap={4}>
        <InputForm
          name="email"
          label="E-mail"
          control={control}
          errors={errors}
          />
      </FormRow>
      <Divider />
      <FormRow className="pb-1 pt-4 flex-col">
        <FormTitle addClassName="text-medium" title="Credenciais" as="h2" />
        <FormTitle addClassName="text-sm color !text-gray-500 normal-case !block" title="A senha será alterada apenas se os campos abaixo forem preenchidos" as="h3" />
      </FormRow>
      <FormRow className="" gap={4}>
        <InputForm
          name="password"
          label="Nova Senha"
          type="password"
          autoComplete="new-password"
          control={control}
          errors={errors}
          />
        <InputForm
          name="passwordConfirm"
          label="Confirmar Nova Senha"
          type="password"
          autoComplete="new-password"
          control={control}
          errors={errors}
          />
      </FormRow>

        <Divider />

        <FormRow className="justify-end">
          <Button color="primary" type="submit" isDisabled={doingRequest}>
            { !doingRequest ? 'Salvar Perfil' : <><LoadingCircleIcon />Salvando...</>}
          </Button>
        </FormRow>
    </form>
  )
}

export default FormEditarPerfil;