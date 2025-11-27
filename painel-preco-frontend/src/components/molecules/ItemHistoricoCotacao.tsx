"use client";

import { IHistoricoCotacao } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Download,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { catchErrorFromFetch } from "@/utils/requestUtils";
import { downloadPDF } from "@/utils/fileUtils";
import { apiClientGetItemHistorico } from "@/hooks/apiclient";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IProps {
  item: IHistoricoCotacao;
}

export default function ItemHistoricoCotacao({ item }: IProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!item.uuid || isLoading) return;

    try {
      setIsLoading(true);
      const res = await apiClientGetItemHistorico([
        { val: item.uuid, param: "uuid" },
      ]);
      if (res) {
        downloadPDF(res.nomeArquivo, res.arquivo);
      }
    } catch (err) {
      catchErrorFromFetch(err, "arquivo da cotação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    router.push(`/cotacoes/validacao/${item.hashValidacao}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4">
      {/* Coluna esquerda: Ícone + Detalhes */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 text-center sm:text-left">
        <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-lg mb-1 text-foreground">
            {item.nome}
          </h4>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p className="text-sm flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Cotação realizada em: {item.criadoEm}
              </span>
            </p>

            <span>
              <span className="font-medium">Código de Validação:</span>{" "}
              <Badge variant="outline" className="text-xs">
                {item.hashValidacao}
              </Badge>
            </span>
          </div>
        </div>
      </div>

      {/* Coluna direita: Botões */}
      <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
        {/* Botão de Detalhes com Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleViewDetails}
              className="rounded-full border hover:bg-muted/70 transition-colors"
            >
              <ClipboardCheck className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Validar esta cotação</p>
          </TooltipContent>
        </Tooltip>

        {/* Botão de Download com Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDownloadPDF}
              className={cn(
                "rounded-full border hover:bg-muted/70 transition-colors",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar arquivo PDF da cotação</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
