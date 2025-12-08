"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";

import { messages } from "@/utils/messages";
import { INITIAL_PAGE_LOGGED } from "@/utils/routesUtils";
import { loginAction } from "@/app/action/loginActions";
import { notify } from "@/components/molecules/NotifyToast";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z.object({
  login: z.string().min(1, "O login é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

const initialForm: FormData = {
  login: "",
  password: "",
};

type Props = {
  session: Session | null;
  className?: string;
  callbackUrl?: string;
  error?: string;
  onThemeToggle?: () => void;
};

export default function Login(props: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [doingRequest, setDoingRequest] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialForm,
  });

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    try {
      setDoingRequest(true);

      const res = await loginAction({
        username: data.login,
        password: data.password,
        redirect: props.callbackUrl || INITIAL_PAGE_LOGGED,
      });

      if (!res?.success) {
        if (res?.error === messages.LOGIN_WRONG) {
          notify("error", "Credenciais inválidas", res.error);

          setError("login", { type: "manual", message: res.error });
          setError("password", { type: "manual", message: res.error });
        } else {
          notify(
            "error",
            "Erro no login",
            res?.message || res?.error || "Erro desconhecido."
          );
        }
        setDoingRequest(false);
        return;
      }

      router.push(props.callbackUrl || INITIAL_PAGE_LOGGED);
      notify("success", "Login realizado com sucesso", messages.LOGIN_SUCCESS);
    } catch (e) {
      setDoingRequest(false);
      notify(
        "error",
        "Erro no login",
        "Não foi possível realizar o login. Tente novamente mais tarde."
      );
    }
  };

  const onSubmitError: SubmitErrorHandler<FormData> = (errors) => {
    const firstError = Object.values(errors)[0]?.message;
    notify("error", "Erro no formulário", firstError || messages.LOGIN_ERROR);
  };

  useEffect(() => {
    if (props.error) {
      notify("error", "Erro", props.error);
    }
  }, [props.error]);

  const handleShowPass = () => {
    setShowPass((prev) => !prev);
  };
  return (
    <div className="min-h-screen bg-primary-gradient-custom flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Bem-vindo(a) ao Mural de Preços
          </h1>
          <p className="text-purple-200 text-sm">
            Acesse dados essenciais de forma rápida e segura
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white font-semibold text-center">
              Acessar Conta
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-white font-medium">
                  Usuário / E-mail
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    id="login"
                    type="text"
                    placeholder="Digite seu usuário ou e-mail"
                    autoComplete="username"
                    autoFocus
                    {...register("login")}
                    className={cn(
                      "pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300",
                      "focus:border-purple-400 focus:ring-purple-400/20",
                      "hover:border-purple-400/50 transition-colors",
                      errors.login &&
                        "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    )}
                  />
                </div>
                {errors.login && (
                  <p className="text-sm text-red-400">{errors.login.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    {...register("password")}
                    className={cn(
                      "pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300",
                      "focus:border-purple-400 focus:ring-purple-400/20",
                      "hover:border-purple-400/50 transition-colors",
                      errors.password &&
                        "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                    onClick={handleShowPass}
                  >
                    {showPass ? (
                      <Eye className="w-4 h-4 text-purple-300" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-purple-300" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-purple-300 hover:text-white p-0 h-auto font-normal"
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </CardContent>

            <Separator className="bg-white/20" />

            <CardFooter className="flex-col space-y-4 pt-6">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/20 text-purple-300 hover:text-white hover:border-purple-400 bg-white/5 hover:bg-white/10"
                >
                  Solicitar Acesso
                </Button>
                <Button
                  type="submit"
                  disabled={doingRequest}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {doingRequest ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Acessando...
                    </>
                  ) : (
                    <>
                      Acessar Painel
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center text-purple-300 text-xs">
                <Shield className="w-3 h-3 text-green-400 mr-2" />
                Conexão segura e criptografada
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
