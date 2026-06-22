"use client";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/molecules/page-header";
import { toast } from "sonner";
import type { Organizacao, Usuario } from "@/interfaces/gestao";
import { UsuariosTable } from "@/components/molecules/UsuariosTable";
import { useAuthSession } from "@/context/AuthContext";
import { useAppSelector } from "@/store/store";

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

export function GestaoOrganizacaoTemplate() {
  const { data: session } = useAuthSession();
  const sessionState = useAppSelector((state) => state.sessionReducer);
  const orgName = sessionState.org || session?.userInfo?.organizacao?.nome || "Sua Organização";

  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersRes = await fetch("/api/usuarios/minha-organizacao");
      if (!usersRes.ok) throw new Error(await parseApiError(usersRes, "Erro ao buscar usuários"));

      const usersData = await usersRes.json();
      setUsuarios(usersData.content ?? usersData ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        title="Gestão da Organização"
        subtitle={`Gerencie os usuários de "${orgName}"`}
      />

      <div className="mt-6">
        <UsuariosTable
          usuarios={usuarios}
          organizacoes={[]} // Não é necessário para o gestor
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
          onReativar={handleReativarUser}
          isGestor={true}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
