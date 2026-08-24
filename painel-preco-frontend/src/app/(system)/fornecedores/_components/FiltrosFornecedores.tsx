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
import type { FornecedoresFiltros } from "../_lib/fornecedoresQuery";
import type { FornecedorPorteItem } from "./types";

type Props = {
  filtros: FornecedoresFiltros;
  onAplicar: (filtros: FornecedoresFiltros) => void;
};

export function FiltrosFornecedores({ filtros, onAplicar }: Props) {
  const [form, setForm] = useState<FornecedoresFiltros>(filtros);
  const [portes, setPortes] = useState<string[]>([]);

  useEffect(() => setForm(filtros), [filtros]);

  // Carrega os portes existentes uma única vez (sem filtro) para popular o select.
  useEffect(() => {
    fetch("/api/dashboard/fornecedores?recurso=por-porte")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: FornecedorPorteItem[]) => {
        if (Array.isArray(data)) {
          const nomes = data.map((d) => d.porte).filter(Boolean).sort((a, b) => a.localeCompare(b));
          setPortes(nomes);
        }
      })
      .catch(() => setPortes([]));
  }, []);

  const limpar = () => {
    const vazio: FornecedoresFiltros = {
      dataInicio: null,
      dataFim: null,
      nome: null,
      documento: null,
      porte: null,
    };
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
            <Label htmlFor="forn-data-inicio">Abertura a partir de</Label>
            <Input
              id="forn-data-inicio"
              type="date"
              value={form.dataInicio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="forn-data-fim">Abertura até</Label>
            <Input
              id="forn-data-fim"
              type="date"
              value={form.dataFim ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, dataFim: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="forn-nome">Nome do fornecedor</Label>
            <Input
              id="forn-nome"
              placeholder="Buscar por nome"
              value={form.nome ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="forn-documento">CNPJ/CPF</Label>
            <Input
              id="forn-documento"
              placeholder="Documento exato"
              value={form.documento ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value || null }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="forn-porte">Porte</Label>
            <Select
              value={form.porte ?? "all"}
              onValueChange={(v) => setForm((f) => ({ ...f, porte: v === "all" ? null : v }))}
            >
              <SelectTrigger id="forn-porte">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {portes.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
