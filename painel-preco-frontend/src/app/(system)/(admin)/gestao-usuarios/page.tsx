"use client";
import { useState, useEffect, useCallback } from "react";
import { Building2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/molecules/page-header";
import type { Organizacao, Usuario } from "@/interfaces/gestao";
import { OrganizacoesTable } from "@/components/molecules/OrganizacoesTable";
import { UsuariosTable } from "@/components/molecules/UsuariosTable";

async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    const raw: string = body?.message ?? body?.error ?? fallback;
    // Extract the meaningful part from Spring Boot exception wrappers
    // e.g. "Request processing failed; nested exception is ...ArchException: Email já cadastrado"
    const match = raw.match(/ArchException:\s*(.+)$/);
    return match ? match[1].trim() : raw;
  } catch {
    return fallback;
  }
}

export default function GestaoUsuarios() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const fetchData = useCallback(async () => {
    const [orgsRes, usersRes] = await Promise.all([
      fetch("/api/organizacoes"),
      fetch("/api/usuarios"),
    ]);
    if (orgsRes.ok) {
      const orgsData = await orgsRes.json();
      setOrganizacoes(orgsData.content ?? orgsData ?? []);
    }
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      setUsuarios(usersData.content ?? usersData ?? []);
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

  const handleSaveUser = async (data: object, id?: string) => {
    const res = id
      ? await fetch(`/api/usuarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
    if (!res.ok) throw new Error(await parseApiError(res, "Erro ao salvar usuário"));
    await fetchData();
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(await parseApiError(res, "Erro ao desativar usuário"));
    await fetchData();
  };

  const handleReativarUser = async (id: string) => {
    const res = await fetch(`/api/usuarios/${id}/reativar`, { method: "PUT" });
    if (!res.ok) throw new Error(await parseApiError(res, "Erro ao reativar usuário"));
    await fetchData();
  };

  return (
    <main>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie organizações e usuários do sistema"
      />

      <Tabs defaultValue="organizacoes" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="organizacoes" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizações
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizacoes" className="mt-6">
          <OrganizacoesTable
            organizacoes={organizacoes}
            onSave={handleSaveOrg}
            onDelete={handleDeleteOrg}
            onReativar={handleReativarOrg}
          />
        </TabsContent>

        <TabsContent value="usuarios" className="mt-6">
          <UsuariosTable
            usuarios={usuarios}
            organizacoes={organizacoes}
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            onReativar={handleReativarUser}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}

