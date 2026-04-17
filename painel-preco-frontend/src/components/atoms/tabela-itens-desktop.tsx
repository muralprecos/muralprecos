"use client";

import { useState } from "react";
import {
  calcUnityValueByQuantity,
  parseCurrency,
  formatCurrency,
} from "@/utils/formatCurrency";
import { parseNumber } from "@/utils/stringUtils";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/molecules/CartButton";
import {
  ClipboardList,
  MapPin,
  Calendar,
  SlidersHorizontal,
  EyeOff,
  Eye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SortSelect from "@/components/atoms/SortSelect";

interface IProps {
  itens: IRetornoPesquisaItensLicitacao[];
  onSelectItem: (uuid: string) => void;
  setIsLoading?: (v: boolean) => void;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
}

export default function TabelaItensLicitacaoDesktop({
  itens,
  onSelectItem,
  setIsLoading,
  currentSort = "",
  onSortChange,
}: IProps) {
  // Colunas opcionais
  const [showUnidade, setShowUnidade] = useState(false);
  const [showQuantidade, setShowQuantidade] = useState(false);
  const [showValorTotal, setShowValorTotal] = useState(false);
  const [showLocalizacao, setShowLocalizacao] = useState(false);

  const handleSelect = (uuid: string) => {
    if (setIsLoading) setIsLoading(true);
    onSelectItem(uuid);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showUnidade}
              onCheckedChange={setShowUnidade}
            >
              Unidade
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showQuantidade}
              onCheckedChange={setShowQuantidade}
            >
              Quantidade
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showValorTotal}
              onCheckedChange={setShowValorTotal}
            >
              Valor Total
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showLocalizacao}
              onCheckedChange={setShowLocalizacao}
            >
              Localização
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {onSortChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
            <SortSelect
              value={currentSort}
              onValueChange={onSortChange}
              triggerClassName="w-[220px]"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto lg:overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>

              {showUnidade && <TableHead>Unidade</TableHead>}

              {showQuantidade && (
                <TableHead>Quantidade</TableHead>
              )}

              <TableHead className="text-right">Valor Unitário</TableHead>

              {showValorTotal && (
                <TableHead className="text-right">Valor Total</TableHead>
              )}

              {showLocalizacao && (
                <TableHead className="text-right">Localização</TableHead>
              )}

              <TableHead className="text-right">Data</TableHead>

              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {itens.map((item) => {
              const unitValue = calcUnityValueByQuantity(
                parseCurrency(item.valor),
                item.quantidade,
              );

              return (
                <TableRow key={item.uuid}>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="font-medium text-foreground truncate">
                            {item.descricao}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[400px]">
                          <p className="font-medium">{item.descricao}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>

                  {showUnidade && (
                    <TableCell>
                      <Badge variant="outline">
                        {item.unidadeFornecimento?.nome || "-"}
                      </Badge>
                    </TableCell>
                  )}

                  {showQuantidade && (
                    <TableCell className="text-center">
                      {parseNumber(item.quantidade)}
                    </TableCell>
                  )}

                  <TableCell className="text-right font-semibold text-primary">
                    {formatCurrency(unitValue)}
                  </TableCell>

                  {showValorTotal && (
                    <TableCell className="text-right font-semibold">
                      {item.valor}
                    </TableCell>
                  )}

                  {showLocalizacao && (
                    <TableCell className="text-sm text-muted-foreground text-right flex items-center justify-end gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {item.licitacao?.municipio?.nome}
                    </TableCell>
                  )}

                  <TableCell className="text-sm text-muted-foreground text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.licitacao?.dataResultadoCompra}
                    </div>
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
