"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { AtasFiltros } from "../_lib/atasQuery";

const SITUACOES = ["Vigente", "Vencida", "Cancelada"];

type Props = {
  filtros: AtasFiltros;
  onAplicar: (filtros: AtasFiltros) => void;
};

export function FiltrosAtas({ filtros, onAplicar }: Props) {
  const [form, setForm] = useState<AtasFiltros>(filtros);

  useEffect(() => setForm(filtros), [filtros]);

  const limpar = () => {
    const vazio: AtasFiltros = { dataInicio: null, dataFim: null, situacao: null, objeto: null };
    setForm(vazio);
    onAplicar(vazio);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={(e) => {
            e.preventDefault();
            onAplicar(form);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="ata-data-inicio">Vigência a partir de</Label>
            <Input
              id="ata-data-inicio"
              type="date"
              value={form.dataInicio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ata-data-fim">Vigência até</Label>
            <Input
              id="ata-data-fim"
              type="date"
              value={form.dataFim ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, dataFim: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ata-situacao">Situação</Label>
            <Select
              value={form.situacao ?? "all"}
              onValueChange={(v) => setForm((f) => ({ ...f, situacao: v === "all" ? null : v }))}
            >
              <SelectTrigger id="ata-situacao">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {SITUACOES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <Label htmlFor="ata-objeto">Objeto</Label>
            <Input
              id="ata-objeto"
              placeholder="Buscar por palavra-chave no objeto"
              value={form.objeto ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, objeto: e.target.value || null }))}
            />
          </div>

          <div className="flex items-end gap-2 lg:col-span-5">
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" /> Filtrar
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={limpar}>
              <X className="h-4 w-4" /> Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
