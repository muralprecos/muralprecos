import { getValidateCotacao } from "@/hooks/api";
import DownloadButton from "./downloadButton";
import { IResValidacaoCotacao, IValidaCotacao } from "@/interfaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";

const naoValidado = (uuid: string): IResValidacaoCotacao => {
  return {
    isok: false,
    uuid: uuid,
    message: "Cotação INVÁLIDA",
  };
};

export default async function ValidaItens({ itens }: { itens: string[] }) {
  const validacoes: IResValidacaoCotacao[] = await Promise.all(
    itens.map(async (item) => {
      try {
        const res = await getValidateCotacao(item);
        if (res != null && "hashValidacao" in res) {
          const validateCotacao = res as IValidaCotacao;
          return {
            isok: true,
            uuid: item,
            validacao: validateCotacao,
            message: "Cotação validada com sucesso!",
          };
        } else {
          return naoValidado(item);
        }
      } catch (error) {
        return naoValidado(item);
      }
    })
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {validacoes.map((val) => {
        const isOk = val.isok;
        const colors = isOk
          ? {
              bg: "bg-emerald-50 dark:bg-emerald-950/20",
              border: "border-emerald-200",
              text: "text-emerald-800 dark:text-emerald-200",
              badge:
                "border-emerald-600 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              iconColor: "text-emerald-600",
              icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
            }
          : {
              bg: "bg-red-50 dark:bg-red-950/20",
              border: "border-red-200",
              text: "text-red-800 dark:text-red-200",
              badge:
                "border-red-600 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              iconColor: "text-red-600",
              icon: <Shield className="h-5 w-5 text-red-600" />,
            };

        return (
          <div key={val.uuid} className="space-y-4 max-w-[600px] w-full mt-4">
            {isOk && (
              <Alert className={`${colors.border} ${colors.bg}`}>
                <div className="flex items-center gap-2 justify-center">
                  {colors.icon}
                  <AlertDescription className={colors.text}>
                    {val.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            <Card>
              <CardContent className="pt-6 space-y-4 text-center">
                <div
                  className={`p-3 rounded-full w-fit mx-auto ${
                    isOk
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {isOk ? (
                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Shield className="h-8 w-8 text-red-600" />
                  )}
                </div>
                {isOk && (
                  <div>
                    <h3
                      className={`font-mono text-sm text-muted-foreground mb-3`}
                    >
                      {val.uuid}
                    </h3>
                    <Badge variant="outline" className={`mt-2 ${colors.badge}`}>
                      Cotação {val.message.split(" ")[1]}
                    </Badge>
                  </div>
                )}
                {val.validacao ? (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Criado em:
                        </span>
                        <span>{val.validacao.criadoEm}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Arquivo:
                        </span>
                        <span>{val.validacao.nomeArquivo}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className={`text-sm `}>
                        <span className="font-medium text-foreground">
                          Descrição:
                        </span>{" "}
                        {val.validacao.nome}
                      </p>
                    </div>

                    <DownloadButton
                      file={val.validacao.arquivo}
                      filename={val.validacao.nomeArquivo}
                    >
                      Baixar Cópia - {val.message}
                    </DownloadButton>
                  </>
                ) : (
                  <>
                    <div className="bg-card rounded-2xl shadow-sm p-8 text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Cotação não encontrada
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        O código informado não corresponde a nenhuma cotação em
                        nosso sistema. Verifique se o código foi digitado
                        corretamente.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
