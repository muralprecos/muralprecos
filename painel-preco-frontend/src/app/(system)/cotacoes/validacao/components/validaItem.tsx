import { getValidateCotacao } from "@/hooks/api";
import DownloadButton from "./downloadButton";
import { IResValidacaoCotacao, IValidaCotacao } from "@/interfaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

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
              bg: "bg-green-50 dark:bg-green-950/20",
              border: "border-green-200",
              text: "text-green-800 dark:text-green-200",
              badge: "border-green-600 text-green-700 dark:text-green-300",
              iconColor: "text-green-600",
              icon: <CheckCircle className="h-5 w-5 text-green-600" />,
            }
          : {
              bg: "bg-red-50 dark:bg-red-950/20",
              border: "border-red-200",
              text: "text-red-800 dark:text-red-200",
              badge: "border-red-600 text-red-700 dark:text-red-300",
              iconColor: "text-red-600",
              icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
            };

        return (
          <div key={val.uuid} className="space-y-4 max-w-[600px] w-full mt-4">
            <Alert className={`${colors.border} ${colors.bg}`}>
              <div className="flex items-center gap-2 justify-center">
                {colors.icon}
                <AlertDescription className={colors.text}>
                  {val.message}
                </AlertDescription>
              </div>
            </Alert>
            <Card className={`${colors.bg} ${colors.border}`}>
              <CardContent className="pt-6 space-y-4 text-center">
                <div
                  className={`p-3 rounded-full w-fit mx-auto ${
                    isOk
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {isOk ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>

                <div>
                  <h3 className={`font-medium ${colors.text}`}>{val.uuid}</h3>
                  <Badge variant="outline" className={`mt-2 ${colors.badge}`}>
                    Cotação {val.message.split(" ")[1]}
                  </Badge>
                </div>

                {val.validacao ? (
                  <>
                    <div className={`space-y-2 text-sm ${colors.text}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Criado em:</span>
                        <span>{val.validacao.criadoEm}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Arquivo:</span>
                        <span>{val.validacao.nomeArquivo}</span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isOk
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      <p className={`text-sm ${colors.text}`}>
                        <span className="font-medium">Descrição:</span>{" "}
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
                  <p className={`font-bold ${colors.text}`}>{val.message}</p>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
