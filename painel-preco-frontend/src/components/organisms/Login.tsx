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
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";

import { messages } from "@/utils/messages";
import { INITIAL_PAGE_LOGGED } from "@/utils/routesUtils";
import { notify } from "@/components/molecules/NotifyToast";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "dev";

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

      const res = await signIn("credentials", {
        username: data.login,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === messages.LOGIN_WRONG) {
          notify("error", "Credenciais inválidas", res.error);
          setError("login", { type: "manual", message: res.error });
          setError("password", { type: "manual", message: res.error });
        } else {
          notify(
            "error",
            "Erro no login",
            res?.error || "Erro desconhecido."
          );
        }
        setDoingRequest(false);
        return;
      }
      

      notify("success", "Login realizado com sucesso", messages.LOGIN_SUCCESS);
      // IMPORTANTE: forçar refresh da sessão
      router.refresh();
      router.push(props.callbackUrl || INITIAL_PAGE_LOGGED);
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
            <CardFooter className="flex-col space-y-5 pt-6">
              <div className="flex gap-3 w-full">
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 h-11",
                    "bg-white/5 backdrop-blur-sm",
                    "border-white/20 hover:border-purple-400/60",
                    "text-purple-200 hover:text-white",
                    "hover:bg-white/10",
                    "transition-all duration-300",
                    "shadow-sm hover:shadow-md hover:shadow-purple-500/10"
                  )}
                >
                  <Link
                    href="https://cal.com/ttsolucoes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Solicitar Acesso
                  </Link>
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 h-11",
                    "bg-emerald-500/10 backdrop-blur-sm",
                    "border-emerald-400/30 hover:border-emerald-400/60",
                    "text-emerald-300 hover:text-emerald-200",
                    "hover:bg-emerald-500/20",
                    "transition-all duration-300",
                    "shadow-sm hover:shadow-md hover:shadow-emerald-500/10"
                  )}
                >
                  <Link href="/validar-cotacao">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Validar Cotação
                  </Link>
                </Button>
              </div>
              <Button
                type="submit"
                disabled={doingRequest}
                className={cn(
                  "w-full h-12 text-base font-semibold",
                  "bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600",
                  "hover:from-purple-400 hover:via-purple-500 hover:to-indigo-500",
                  "shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)]",
                  "transition-all duration-300 transform hover:scale-[1.02]",
                  "border border-purple-400/30",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                )}
              >
                {doingRequest ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Acessando...
                  </>
                ) : (
                  <>
                    Acessar Painel
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center text-purple-300/70 text-xs pt-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                Conexão segura e criptografada
              </div>
              <div className="flex items-center justify-center text-purple-300/60 text-[10px]">
                Versão {appVersion}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
