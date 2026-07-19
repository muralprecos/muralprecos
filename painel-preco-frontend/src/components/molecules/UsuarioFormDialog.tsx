"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeycloakSyncWarning } from "@/components/atoms/KeycloakSyncWarning";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Organizacao, Usuario } from "@/interfaces/gestao";

interface CreateUserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizacaoId: string;
}

interface EditUserData {
  firstName: string;
  lastName: string;
  email: string;
  organizacaoId: string;
  password?: string;
}

interface UsuarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: Usuario | null;
  organizacoes: Organizacao[];
  onSave: (data: CreateUserData | EditUserData, id?: string) => Promise<void>;
  isGestor?: boolean;
  fixedOrganizacaoId?: string; // Se fornecido, pré-seleciona e desabilita alteração da organização
}

export function UsuarioFormDialog({
  open,
  onOpenChange,
  editingUser,
  organizacoes,
  onSave,
  isGestor = false,
  fixedOrganizacaoId,
}: UsuarioFormDialogProps) {
  const [createForm, setCreateForm] = useState<CreateUserData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizacaoId: "",
  });
  const [editForm, setEditForm] = useState<EditUserData>({
    firstName: "",
    lastName: "",
    email: "",
    organizacaoId: "",
    password: "",
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detalhesUsuario, setDetalhesUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (open) {
      if (editingUser) {
        const [firstName = "", ...rest] = (editingUser.nome ?? "").split(" ");
        const lastName = rest.join(" ");
        setEditForm({
          firstName,
          lastName,
          email: editingUser.email ?? "",
          organizacaoId: fixedOrganizacaoId ?? editingUser.organizacaoId ?? "",
          password: "",
        });
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordError("");
        setDetalhesUsuario(null);

        const fetchDetails = async () => {
          setDetalhesLoading(true);
          try {
            const res = await fetch(`/api/usuarios/${editingUser.id}`);
            if (res.ok) {
              const data = await res.json();
              data.detalhesUltimaSincronizacao = editingUser.detalhesUltimaSincronizacao;
              data.dataUltimaSincronizacao = editingUser.dataUltimaSincronizacao;
              setDetalhesUsuario(data);
            }
          } catch (err) {
            console.error("Erro ao buscar detalhes:", err);
          } finally {
            setDetalhesLoading(false);
          }
        };
        fetchDetails();
      } else {
        setCreateForm({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          organizacaoId: fixedOrganizacaoId ?? "",
        });
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordError("");
      }
    }
  }, [open, editingUser, fixedOrganizacaoId]);

  const handleSave = async () => {
    if (editingUser) {
      if (!editForm.firstName || !editForm.email) {
        toast.error("Nome e email são obrigatórios");
        return;
      }
      if (editForm.password && editForm.password !== confirmPassword) {
        setPasswordError("As senhas não coincidem");
        return;
      }
    } else {
      if (
        !createForm.username ||
        !createForm.firstName ||
        !createForm.email ||
        !createForm.password ||
        (!isGestor && !createForm.organizacaoId)
      ) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      if (createForm.password !== confirmPassword) {
        setPasswordError("As senhas não coincidem");
        return;
      }
    }

    setSaving(true);
    try {
      if (editingUser) {
        const dataToSave: EditUserData = { ...editForm };
        if (!dataToSave.password) delete dataToSave.password;
        await onSave(dataToSave, editingUser.id);
        toast.success("Usuário atualizado com sucesso");
      } else {
        await onSave(createForm);
        toast.success("Usuário criado com sucesso");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar usuário");
    } finally {
      setSaving(false);
    }
  };

  const activeOrgs = organizacoes.filter((org) => org.ativo);
  // Se houver uma organização fixa e ela não estiver ativa, garante que ela apareça nas opções
  if (fixedOrganizacaoId && !activeOrgs.some((o) => o.id.toString() === fixedOrganizacaoId.toString())) {
    const fixedOrg = organizacoes.find((o) => o.id.toString() === fixedOrganizacaoId.toString());
    if (fixedOrg) {
      activeOrgs.push(fixedOrg);
    }
  }

  const renderForm = () => (
    <>
      {editingUser && detalhesUsuario?.keycloakNaoEncontrado && (
        <KeycloakSyncWarning message="Usuário desincronizado. Alterações podem não ser aplicadas no Keycloak." />
      )}
      {!editingUser && (
        <div className="grid gap-2">
          <Label htmlFor="username">Login *</Label>
          <Input
            id="username"
            value={createForm.username}
            onChange={(e) =>
              setCreateForm({ ...createForm, username: e.target.value })
            }
            placeholder="nome.usuario"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">Nome *</Label>
          <Input
            id="firstName"
            value={editingUser ? editForm.firstName : createForm.firstName}
            onChange={(e) =>
              editingUser
                ? setEditForm({ ...editForm, firstName: e.target.value })
                : setCreateForm({ ...createForm, firstName: e.target.value })
            }
            placeholder="Primeiro nome"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            value={editingUser ? editForm.lastName : createForm.lastName}
            onChange={(e) =>
              editingUser
                ? setEditForm({ ...editForm, lastName: e.target.value })
                : setCreateForm({ ...createForm, lastName: e.target.value })
            }
            placeholder="Sobrenome"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={editingUser ? editForm.email : createForm.email}
          onChange={(e) =>
            editingUser
              ? setEditForm({ ...editForm, email: e.target.value })
              : setCreateForm({ ...createForm, email: e.target.value })
          }
          placeholder="email@empresa.com"
        />
      </div>
      {!isGestor && (
        <div className="grid gap-2">
          <Label htmlFor="organizacao">Organização *</Label>
          <Select
            value={
              editingUser
                ? editForm.organizacaoId?.toString()
                : createForm.organizacaoId?.toString()
            }
            onValueChange={(value) =>
              editingUser
                ? setEditForm({ ...editForm, organizacaoId: value })
                : setCreateForm({ ...createForm, organizacaoId: value })
            }
            disabled={!!fixedOrganizacaoId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma organização" />
            </SelectTrigger>
            <SelectContent>
              {activeOrgs.map((org) => (
                <SelectItem key={org.id.toString()} value={org.id.toString()}>
                  {org.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <hr className="my-2 border-t border-border" />
      <div className="grid gap-2">
        <Label htmlFor="password">
          {editingUser ? "Nova Senha" : "Senha *"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={editingUser ? (editForm.password ?? "") : createForm.password}
            onChange={(e) => {
              setPasswordError("");
              editingUser
                ? setEditForm({ ...editForm, password: e.target.value })
                : setCreateForm({ ...createForm, password: e.target.value });
            }}
            placeholder={editingUser ? "Deixe em branco para não alterar" : "Mínimo 6 caracteres"}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">
          {editingUser ? "Confirmar Nova Senha" : "Confirmar Senha *"}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setPasswordError("");
              setConfirmPassword(e.target.value);
            }}
            placeholder="Repita a senha"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {passwordError && (
          <p className="text-xs text-red-500">{passwordError}</p>
        )}
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editingUser && detalhesLoading ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            </>
          ) : (
            <>
              {editingUser && !isGestor ? (
                <Tabs defaultValue="dados">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dados">Dados Principais</TabsTrigger>
                    <TabsTrigger value="sync">Sincronização</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dados" className="space-y-4 mt-4">
                    {renderForm()}
                  </TabsContent>
                  <TabsContent value="sync" className="space-y-4 mt-4">
                    <div className="grid gap-2">
                      <Label>Detalhes da Sincronização</Label>
                      <div className="text-sm p-3 border rounded-md bg-muted/50">
                        {detalhesUsuario?.detalhesUltimaSincronizacao || "Nenhuma sincronização registrada"}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Data da Última Sincronização</Label>
                      <div className="text-sm p-3 border rounded-md bg-muted/50">
                        {detalhesUsuario?.dataUltimaSincronizacao ? new Date(detalhesUsuario.dataUltimaSincronizacao).toLocaleString("pt-BR") : "-"}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                renderForm()
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
