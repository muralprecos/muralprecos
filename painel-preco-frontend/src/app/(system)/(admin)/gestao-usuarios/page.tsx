"use client";
import { useState } from "react";
import { Building2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/molecules/page-header";
import type { Organizacao, Usuario } from "@/interfaces/gestao";
import { OrganizacoesTable } from "@/components/molecules/OrganizacoesTable";
import { UsuariosTable } from "@/components/molecules/UsuariosTable";
import { mockOrganizacoes, mockUsuarios } from "@/lib/gestaoMock";

export default function GestaoUsuarios() {
  const [organizacoes, setOrganizacoes] =
    useState<Organizacao[]>(mockOrganizacoes);
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);

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
            onUpdate={setOrganizacoes}
          />
        </TabsContent>

        <TabsContent value="usuarios" className="mt-6">
          <UsuariosTable
            usuarios={usuarios}
            organizacoes={organizacoes}
            onUpdate={setUsuarios}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
