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
  Search,
  MapPin,
  Calendar,
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
import { Input } from "../ui/input";

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

export default function TabelaItensLicitacao({
  itens,
  onSelectItem,
  setIsLoading,
}: IProps) {
  const [sortField, setSortField] = useState<SortField>("descricao");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
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
      case "descricao":
        comp = a.descricao.localeCompare(b.descricao);
        break;
      case "localizacao":
        comp = a.licitacao.municipio.nome.localeCompare(
          b.licitacao.municipio.nome
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

  const exibidos = sorted;

  if (itens.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border text-center">
        Nenhum item encontrado.
      </div>
    );
  }

  return (
    <div className="bg-card overflow-hidden animate-fade-in">
      <div className="hidden md:block overflow-x-auto">
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

              <TableHead>Unidade</TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setSortField("quantidade");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Qtd <SortIcon field="quantidade" />
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                onClick={() => {
                  setSortField("valor-unitario");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Valor Unitário <SortIcon field="valor-unitario" />
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right transition-colors"
                onClick={() => {
                  setSortField("valor-total");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Valor Total <SortIcon field="valor-total" />
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right transition-colorstext-right"
                onClick={() => {
                  setSortField("localizacao");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Localização
                <SortIcon field="localizacao" />
              </TableHead>

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
            {exibidos.map((item) => {
              const unitValue = calcUnityValueByQuantity(
                parseCurrency(item.valor),
                item.quantidade
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

                  <TableCell>
                    <Badge variant="outline">
                      {item.unidadeFornecimento?.nome || "-"}
                    </Badge>
                  </TableCell>

                  <TableCell>{parseNumber(item.quantidade)}</TableCell>

                  <TableCell className="text-right font-semibold text-primary">
                    {formatCurrency(unitValue)}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {item.valor}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground text-right flex items-center justify-end gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    {item.licitacao?.municipio?.nome}
                  </TableCell>

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

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {exibidos.map((item) => {
          const unitValue = calcUnityValueByQuantity(
            parseCurrency(item.valor),
            item.quantidade
          );

          return (
            <div key={item.uuid} className="p-4 space-y-3">
              {/* Header */}
              <div>
                <p className="font-medium text-foreground line-clamp-2">
                  {item.descricao}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {item.unidadeFornecimento?.nome || "-"}
                </Badge>

                <Badge variant="secondary" className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.licitacao?.municipio?.nome}
                </Badge>
              </div>

              {/* Preços + Ação */}
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

              {/* Rodapé */}
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
    </div>
  );
}
