"use client";

import { useState } from "react";
import {
  calcUnityValueByQuantity,
  parseCurrency,
  formatCurrency,
} from "@/utils/formatCurrency";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/molecules/CartButton";
import { ClipboardList, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IProps {
  itens: IRetornoPesquisaItensLicitacao[];
  onSelectItem: (uuid: string) => void;
  setIsLoading?: (v: boolean) => void;
}

export default function ListagemItensLicitacaoMobile({
  itens,
  onSelectItem,
  setIsLoading,
}: IProps) {
  const handleSelect = (uuid: string) => {
    if (setIsLoading) setIsLoading(true);
    onSelectItem(uuid);
  };

  return (
    <div className="divide-y divide-border">
      {itens.map((item) => {
        const unitValue = calcUnityValueByQuantity(
          parseCurrency(item.valor),
          item.quantidade,
        );

        return (
          <div key={item.uuid} className="p-4 space-y-3">
            <div>
              <p className="font-medium text-foreground line-clamp-2">
                {item.descricao}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {item.unidadeFornecimento?.nome || "-"}
              </Badge>

              <Badge variant="secondary" className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {item.licitacao?.municipio?.nome}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(unitValue * item.quantidade)}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground">
                    {item.quantidade} x {formatCurrency(unitValue)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full border hover:bg-muted/70 transition-colors w-8 h-8"
                  onClick={() => handleSelect(item.uuid)}
                >
                  <ClipboardList className="w-4 h-4" />
                </Button>

                <CartButton itemRetornoLicitacao={item} isCompact />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Ref.: {item.licitacao?.dataResultadoCompra}</span>
              <span className="mx-2">•</span>
              <span>{item.licitacao?.anoCompra}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
