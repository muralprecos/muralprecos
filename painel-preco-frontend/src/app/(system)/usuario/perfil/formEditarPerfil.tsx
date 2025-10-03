"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save, User, Lock, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingCircleIcon from "@/components/atoms/LoadingCircleIcon";

import { apiClientPostUserUpdate } from "@/hooks/apiclient";
import { IUserInfo } from "@/interfaces/types";
import { messages } from "@/utils/messages";
import yupStrings from "@/utils/yupStrings";
import { notify } from "@/components/molecules/NotifyToast";

const schema = yup.object({
  firstName: yup.string().required(yupStrings.required),
  lastName: yup.string().required(yupStrings.required),
  email: yup.string().required(yupStrings.required).email("E-mail inválido"),
  password: yup.string(),
  passwordConfirm: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export interface IPageValidacaoClient {
  usuario: IUserInfo;
}

const FormEditarPerfil: React.FC<IPageValidacaoClient> = ({ usuario }) => {
  const router = useRouter();
  const { update } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [doingRequest, setDoingRequest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (usuario != null) {
    initialForm.firstName = usuario.given_name;
    initialForm.lastName = usuario.family_name;
    initialForm.email = usuario.email;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm,
  });

  useEffect(() => {
    if (usuario) reset(initialForm);
  }, [reset, usuario]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setDoingRequest(true);
    try {
      const { firstName, lastName, email, password, passwordConfirm } = data;

      if (password && password !== passwordConfirm) {
        notify("error", messages.FORM_PASSWORD_DONT_MATCH);
        setDoingRequest(false);
        return;
      }

      const res = await apiClientPostUserUpdate({
        firstName,
        lastName,
        email,
        newPassword: password || undefined,
      });

      if (res.success) {
        notify("success", messages.REQUEST_SUCCESS);
        await update({ firstName, lastName, email });
        router.push("/");
      } else {
        notify("error", res.error || messages.REQUEST_ERROR);
      }
    } catch (error) {
      notify("error", messages.REQUEST_ERROR);
    } finally {
      setDoingRequest(false);
    }
  };

  const onSubmitError: SubmitErrorHandler<FormData> = () => {
    notify("error", messages.REQUEST_ERROR);
  };

  return (
    <form
      className="container flex flex-col gap-6 p-6"
      onSubmit={handleSubmit(onSubmit, onSubmitError)}
    >
      {/* Seção Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados Pessoais
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primeiro Nome</Label>
              <Input
                id="firstName"
                placeholder="Digite seu primeiro nome"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Último Nome</Label>
              <Input
                id="lastName"
                placeholder="Digite seu último nome"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2" disabled={doingRequest}>
              {!doingRequest ? (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Perfil
                </>
              ) : (
                <>
                  <LoadingCircleIcon />
                  Salvando...
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção Credenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Credenciais
          </CardTitle>
          <CardDescription>
            A senha será alterada apenas se os campos abaixo forem preenchidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a nova senha"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  {...register("passwordConfirm")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              className="gap-2"
              disabled={doingRequest}
            >
              {!doingRequest ? (
                <>
                  <Lock className="h-4 w-4" />
                  Alterar Senha
                </>
              ) : (
                <>
                  <LoadingCircleIcon />
                  Alterando...
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormEditarPerfil;
