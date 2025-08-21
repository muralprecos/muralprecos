"use client";

import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import { Package, ClipboardList, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import {
  formatCurrency,
  parseCurrency,
  calcUnityValueByQuantity,
} from "@/utils/formatCurrency";
import CartButton from "../molecules/CartButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface IProps {
  item: IRetornoPesquisaItensLicitacao;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  mode?: "list" | "cart";
  onRemoveFromCart?: (item: IRetornoPesquisaItensLicitacao) => void;
}

export default function ItemListLicitacao({
  item,
  setIsLoading,
  mode = "list",
  onRemoveFromCart,
}: IProps) {
  const router = useRouter();

  const handleSelectItem = async (uuid: string) => {
    if (setIsLoading) setIsLoading(true);
    console.log("Item recebido:", item);
    console.log("UUID recebido:", uuid);
    router.push(`/cotacoes/${uuid}`);
  };

  const unitValue = calcUnityValueByQuantity(
    parseCurrency(item.valor),
    item.quantidade
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 text-center sm:text-left">
        <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
          <Package className="h-8 w-8 text-primary" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-lg mb-2 text-foreground">
            {item.descricao}
          </h4>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Quantidade:</span> {item.quantidade}{" "}
              | <span className="font-medium">Unidade:</span>{" "}
              {item.unidadeFornecimento?.nome}
            </div>
            <div>
              <span className="font-medium">Valor:</span> {item.valor} |{" "}
              <span className="font-medium">Valor da Unidade:</span>{" "}
              {formatCurrency(unitValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-2">
        {mode === "list" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <CartButton itemRetornoLicitacao={item} isCompact={true} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar ao carrinho</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemoveFromCart?.(item)}
                className="rounded-full border hover:bg-destructive/80 transition-colors text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover do carrinho</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleSelectItem(item.uuid)}
              className="rounded-full border hover:bg-muted/70 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver detalhes deste item</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
