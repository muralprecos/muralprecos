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
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  SlidersHorizontal,
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

interface IProps {
  itens: IRetornoPesquisaItensLicitacao[];
  onSelectItem: (uuid: string) => void;
  setIsLoading?: (v: boolean) => void;
}

type SortField =
  | "descricao"
  | "quantidade"
  | "valor-unitario"
  | "valor-total"
  | "localizacao"
  | "data";

type SortOrder = "asc" | "desc";

export default function TabelaItensLicitacaoDesktop({
  itens,
  onSelectItem,
  setIsLoading,
}: IProps) {
  const [sortField, setSortField] = useState<SortField>("descricao");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Colunas opcionais
  const [showUnidade, setShowUnidade] = useState(false);
  const [showQuantidade, setShowQuantidade] = useState(false);
  const [showValorTotal, setShowValorTotal] = useState(false);
  const [showLocalizacao, setShowLocalizacao] = useState(false);

  const parseDate = (str: string) => {
    const [d, m, y] = str.split("/");
    return new Date(+y, +m - 1, +d);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const handleSelect = (uuid: string) => {
    if (setIsLoading) setIsLoading(true);
    onSelectItem(uuid);
  };

  const sorted = [...itens].sort((a, b) => {
    let comp = 0;
    switch (sortField) {
      case "descricao":
        comp = a.descricao.localeCompare(b.descricao);
        break;
      case "quantidade":
        comp = (a.quantidade || 0) - (b.quantidade || 0);
        break;
      case "valor-unitario":
        comp = parseCurrency(a.valor) - parseCurrency(b.valor);
        break;
      case "valor-total":
        comp = parseCurrency(a.valor) - parseCurrency(b.valor);
        break;
      case "localizacao":
        comp = a.licitacao.municipio.nome.localeCompare(
          b.licitacao.municipio.nome,
        );
        break;
      case "data":
        comp =
          parseDate(a.licitacao.dataResultadoCompra).getTime() -
          parseDate(b.licitacao.dataResultadoCompra).getTime();
        break;
    }
    return sortOrder === "asc" ? comp : -comp;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
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
      </div>

      <div className="overflow-x-auto lg:overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setSortField("descricao");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Descrição <SortIcon field="descricao" />
              </TableHead>

              {showUnidade && <TableHead>Unidade</TableHead>}

              {showQuantidade && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSortField("quantidade");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Quantidade <SortIcon field="quantidade" />
                </TableHead>
              )}

              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                onClick={() => {
                  setSortField("valor-unitario");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Valor Unitário <SortIcon field="valor-unitario" />
              </TableHead>

              {showValorTotal && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right transition-colors"
                  onClick={() => {
                    setSortField("valor-total");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Valor Total <SortIcon field="valor-total" />
                </TableHead>
              )}

              {showLocalizacao && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right transition-colors"
                  onClick={() => {
                    setSortField("localizacao");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Localização
                  <SortIcon field="localizacao" />
                </TableHead>
              )}

              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right transition-colors"
                onClick={() => {
                  setSortField("data");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Data <SortIcon field="data" />
              </TableHead>

              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sorted.map((item) => {
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
