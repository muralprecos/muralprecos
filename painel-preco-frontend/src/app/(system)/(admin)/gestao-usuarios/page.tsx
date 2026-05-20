"use client";
import { useState, useEffect, useCallback } from "react";
import { Building2, Users, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/molecules/page-header";
import { Button } from "@/components/ui/button";
import { ModalConfirm } from "@/components/molecules/ModalConfirm";
import { SincronizacaoResultadoModal } from "@/components/molecules/SincronizacaoResultadoModal";
import { toast } from "sonner";
import type { Organizacao, Usuario, SincronizacaoResultado } from "@/interfaces/gestao";
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
  const [modalSincronizar, setModalSincronizar] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [resultadoSincronizacao, setResultadoSincronizacao] = useState<SincronizacaoResultado | null>(null);
  const [resultadoModalOpen, setResultadoModalOpen] = useState(false);
  const [executadoEm, setExecutadoEm] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"organizacoes" | "usuarios">("organizacoes");

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

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      const agora = new Date().toISOString();
      const res = await fetch("/api/sincronizacao", { method: "POST" });
      if (!res.ok) throw new Error(await parseApiError(res, "Erro ao sincronizar"));
      const resultado: SincronizacaoResultado = await res.json();
      await fetchData();
      setResultadoSincronizacao(resultado);
      setExecutadoEm(agora);
      setResultadoModalOpen(true);
      toast.success("Sincronização concluída. Veja o detalhamento.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na sincronização");
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <main>
      <PageHeader
        title={activeTab === "organizacoes" ? "Gestão de Organizações" : "Gestão de Usuários"}
        subtitle="Gerencie organizações e usuários do sistema"
      />

      <ModalConfirm
        title="Sincronizar com Keycloak"
        description="Esta operação irá comparar os dados do banco com o Keycloak. Registros ausentes no Keycloak serão desativados. Novos registros do Keycloak serão cadastrados. Deseja continuar?"
        open={modalSincronizar}
        onOpenChange={setModalSincronizar}
        actionYes={handleSincronizar}
      />

      <SincronizacaoResultadoModal
        open={resultadoModalOpen}
        onOpenChange={setResultadoModalOpen}
        resultado={resultadoSincronizacao}
        executadoEm={executadoEm}
      />

      <Tabs defaultValue="organizacoes" className="w-full" onValueChange={(v) => setActiveTab(v as "organizacoes" | "usuarios")}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid max-w-md grid-cols-2">
            <TabsTrigger value="organizacoes" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organizações
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>
          {/* <Button
            onClick={() => setModalSincronizar(true)}
            disabled={sincronizando}
            variant="outline"
            className="bg-surface-plain"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${sincronizando ? "animate-spin" : ""}`} />
            {sincronizando ? "Sincronizando..." : "Sincronizar com Keycloak"}
          </Button> */}
        </div>

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

