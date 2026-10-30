"use client";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import { toast } from "sonner";
import type { Organizacao } from "@/interfaces/gestao";
import { OrganizacoesTable } from "@/components/molecules/OrganizacoesTable";

async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    const raw: string = body?.message ?? body?.error ?? fallback;
    const match = raw.match(/ArchException:\s*(.+)$/);
    return match ? match[1].trim() : raw;
  } catch {
    return fallback;
  }
}

export function AdministracaoOrganizacoesTemplate() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const orgsRes = await fetch("/api/organizacoes");
      if (!orgsRes.ok) throw new Error(await parseApiError(orgsRes, "Erro ao buscar organizações"));

      const orgsData = await orgsRes.json();
      setOrganizacoes(orgsData.content ?? orgsData ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveOrg = async (data: Partial<Organizacao>, id?: string) => {
    const res = id
      ? await fetch(`/api/organizacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      : await fetch("/api/organizacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    if (!res.ok) throw new Error(await parseApiError(res, "Erro ao salvar organização"));
    await fetchData();
  };

  const handleDeleteOrg = async (id: string) => {
    const res = await fetch(`/api/organizacoes/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(await parseApiError(res, "Erro ao desativar organização"));
    await fetchData();
  };

  const handleReativarOrg = async (id: string) => {
    const res = await fetch(`/api/organizacoes/${id}/reativar`, { method: "PUT" });
    if (!res.ok) throw new Error(await parseApiError(res, "Erro ao reativar organização"));
    await fetchData();
  };

  return (
    <main>
      <PageHeader
        title="Gestão de Organizações"
        subtitle="Gerencie as organizações do sistema"
      />

      <div className="mt-6">
        <OrganizacoesTable
          organizacoes={organizacoes}
          onSave={handleSaveOrg}
          onDelete={handleDeleteOrg}
          onReativar={handleReativarOrg}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
