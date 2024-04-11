"use client";

import FormRow from "@/components/atoms/FormRow";
import LoadingCircleIcon from "@/components/atoms/icons/LoadingCircleIcon";
import InputForm from "@/components/molecules/InputForm";
import { messages } from "@/utils/messages";
import { addSnackError } from "@/utils/snackbarUtils";
import yupStrings from "@/utils/yupStrings";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  cotacao: yup.string().required(yupStrings.required)
});
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  cotacao: ''
}

export interface IPageValidacaoClient {
  params: { itens: string[] }
}

const FormValidateItem: React.FC<IPageValidacaoClient> = ({params}) => {

  const router = useRouter();
  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (!!params.itens && params.itens.length > 0) {
    initialForm.cotacao = params.itens.join('/');
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm
  });

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    //console.log(data);
    setDoingRequest(true);
    e?.preventDefault();
    try {
      if (!doingRequest && data.cotacao != '') {
        router.push(`/cotacao/validacao/${data.cotacao}`);
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
      <FormRow className="" gap={0}>
        <InputForm
          name="cotacao"
          label="Código de Validação da Cotação"
          autoFocus
          variant="bordered"
          control={control}
          errors={errors}
          />
        <Button className="h-unit-14 w-full md:w-auto" color="primary" type="submit" isDisabled={doingRequest}>
          { doingRequest ? <><LoadingCircleIcon />Validando Cotação...</> : 'Validar Cotação' }
        </Button>
      </FormRow>
    </form>
  )
}

export default FormValidateItem;