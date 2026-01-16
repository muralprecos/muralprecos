"use client";

import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import {
  calcUnityValueByQuantity,
  parseCurrency,
  formatCurrency,
} from "@/utils/formatCurrency";
import { parseNumber } from "@/utils/stringUtils";
import CartButton from "@/components/molecules/CartButton";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IProps {
  itens: IRetornoPesquisaItensLicitacao[];
  ordenador?: { campo: string; direcao: "asc" | "desc" } | null;
  onOrdenar: (campo: string) => void;
  onSelectItem: (uuid: string) => void;
  setIsLoading?: (v: boolean) => void;
}

export default function TabelaItensLicitacao({
  itens,
  ordenador,
  onOrdenar,
  onSelectItem,
  setIsLoading,
}: IProps) {
  const handleSelect = (uuid: string) => {
    if (setIsLoading) setIsLoading(true);
    onSelectItem(uuid);
  };

  // Aplicar ordenação no front
  const itensOrdenados = [...itens].sort((a, b) => {
    if (!ordenador) return 0;

    const { campo, direcao } = ordenador;

    let x: number;
    let y: number;

    if (campo === "quantidade") {
      x = Number(a.quantidade);
      y = Number(b.quantidade);
    } else if (campo === "valor") {
      x = parseCurrency(a.valor);
      y = parseCurrency(b.valor);
    } else if (campo === "valorUnitario") {
      x = calcUnityValueByQuantity(parseCurrency(a.valor), a.quantidade);
      y = calcUnityValueByQuantity(parseCurrency(b.valor), b.quantidade);
    } else return 0;

    return direcao === "asc" ? x - y : y - x;
  });

  const iconOrdenacao = (campo: string) => {
    if (ordenador?.campo !== campo) return null;
    return ordenador.direcao === "asc" ? "▲" : "▼";
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Descrição</th>

            <th
              className="px-3 py-2 text-left font-medium cursor-pointer select-none"
              onClick={() => onOrdenar("quantidade")}
            >
              Qtd {iconOrdenacao("quantidade")}
            </th>

            <th className="px-3 py-2 text-left font-medium">Unidade</th>

            <th
              className="px-3 py-2 text-right font-medium cursor-pointer select-none"
              onClick={() => onOrdenar("valor")}
            >
              Valor {iconOrdenacao("valor")}
            </th>

            <th
              className="px-3 py-2 text-right font-medium cursor-pointer select-none"
              onClick={() => onOrdenar("valorUnitario")}
            >
              V. Unidade {iconOrdenacao("valorUnitario")}
            </th>

            <th className="px-3 py-2 text-right font-medium">Ações</th>
          </tr>
        </thead>

        <tbody>
          {itensOrdenados.map((item) => {
            const unitValue = calcUnityValueByQuantity(
              parseCurrency(item.valor),
              item.quantidade
            );

            return (
              <tr
                key={item.uuid}
                className="border-b hover:bg-accent/50 transition-colors"
              >
                <td className="px-3 py-3 max-w-[420px] whitespace-normal">
                  {item.descricao}
                </td>

                <td className="px-3 py-3">{parseNumber(item.quantidade)}</td>

                <td className="px-3 py-3">{item.unidadeFornecimento?.nome}</td>

                <td className="px-3 py-3 text-right">{item.valor}</td>

                <td className="px-3 py-3 text-right">
                  {formatCurrency(unitValue)}
                </td>

                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CartButton itemRetornoLicitacao={item} isCompact />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adicionar ao carrinho</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full border hover:bg-muted/70 transition-colors"
                          onClick={() => handleSelect(item.uuid)}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver detalhes</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
