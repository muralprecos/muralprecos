"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingCircleIcon from "@/components/atoms/LoadingCircleIcon";
import InputForm from "@/components/molecules/InputForm";
import { notify } from "@/components/molecules/NotifyToast";
import { Button } from "@/components/ui/button";
import { messages } from "@/utils/messages";
import ZodStrings from "@/utils/ZodStrings";

const schema = z.object({
  cotacao: z.string().min(1, ZodStrings.required || "Campo obrigatório"),
});

type FormData = z.infer<typeof schema>;

export interface IPageValidacaoClient {
  params: { itens: string[] };
}

const FormValidateItem: React.FC<IPageValidacaoClient> = ({ params }) => {
  const router = useRouter();
  const [doingRequest, setDoingRequest] = useState<boolean>(false);

  const defaultCotacaoValue =
    params.itens && params.itens.length > 0 ? params.itens.join("/") : "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cotacao: defaultCotacaoValue,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    setDoingRequest(true);

    try {
      if (data.cotacao.trim() !== "") {
        router.push(`/cotacoes/validacao/${data.cotacao}`);
      }
      setDoingRequest(false);
    } catch (error) {
      setDoingRequest(false);
      console.error(error);
    }
  };

  const onSubmitError: SubmitErrorHandler<FormData> = (errors) => {
    const errorMsg = errors.cotacao?.message || messages.REQUEST_ERROR;
    notify("error", "Erro na validação", errorMsg);
  };

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit(onSubmit, onSubmitError)}
    >
      <div className="flex w-full items-center gap-2">
        <InputForm
          name="cotacao"
          placeholder="Código de Validação da Cotação"
          className="w-full"
          control={control}
          errors={errors}
        />
        <Button type="submit" disabled={doingRequest}>
          {doingRequest ? (
            <>
              <LoadingCircleIcon />
              Validando Cotação...
            </>
          ) : (
            "Validar Cotação"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormValidateItem;
