import { useState } from "react";
import { Users, Edit, Trash2, Plus, Search, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { KeycloakSyncWarning } from "@/components/atoms/KeycloakSyncWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Organizacao, Usuario } from "@/interfaces/gestao";
import { Separator } from "@radix-ui/react-select";

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

interface UsuariosTableProps {
  usuarios: Usuario[];
  organizacoes: Organizacao[];
  onSave: (data: CreateUserData | EditUserData, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReativar: (id: string) => Promise<void>;
  isGestor?: boolean;
  isLoading?: boolean;
}

const emptyCreateForm: CreateUserData = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  organizacaoId: "",
};

const emptyEditForm: EditUserData = {
  firstName: "",
  lastName: "",
  email: "",
  organizacaoId: "",
  password: "",
};

export function UsuariosTable({
  usuarios,
  organizacoes,
  onSave,
  onDelete,
  onReativar,
  isGestor = false,
  isLoading = false,
}: UsuariosTableProps) {
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"ativo" | "inativo" | "todos">("ativo");
  const [organizacaoFiltro, setOrganizacaoFiltro] = useState<string>("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);
  const [detalhesUsuario, setDetalhesUsuario] = useState<Usuario | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserData>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditUserData>(emptyEditForm);
  const [saving, setSaving] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const filteredUsers = usuarios.filter((user) => {
    const term = search.toLowerCase();
    const matchNome =
      user.nome.toLowerCase().includes(term) ||
      (user.email ?? "").toLowerCase().includes(term) ||
      (user.organizacaoNome ?? "").toLowerCase().includes(term);
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" ? user.ativo === true : user.ativo === false);
    const matchOrg = organizacaoFiltro === "todas" || user.organizacaoId === organizacaoFiltro;
    return matchNome && matchStatus && matchOrg;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setCreateForm(emptyCreateForm);
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordError("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = async (user: Usuario) => {
    setEditingUser(user);
    setDetalhesUsuario(null);
    setDetalhesLoading(true);
    const [firstName = "", ...rest] = (user.nome ?? "").split(" ");
    const lastName = rest.join(" ");
    setEditForm({
      firstName,
      lastName,
      email: user.email ?? "",
      organizacaoId: user.organizacaoId ?? "",
      password: "",
    });
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordError("");
    setIsDialogOpen(true);
    try {
      const res = await fetch(`/api/usuarios/${user.id}`);
      if (res.ok) {
        const data: Usuario = await res.json();
        setDetalhesUsuario(data);
      }
    } catch {
      // silently ignore — warning simply won't be shown
    } finally {
      setDetalhesLoading(false);
    }
  };

  const handleOpenDelete = (user: Usuario) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

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
      if (!createForm.username || !createForm.firstName || !createForm.email || !createForm.password || (!isGestor && !createForm.organizacaoId)) {
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
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleReativar = async (user: Usuario) => {
    try {
      await onReativar(user.id);
      toast.success("Usuário reativado com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reativar usuário");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    try {
      await onDelete(deletingUser.id);
      toast.success("Usuário desativado com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover usuário");
    } finally {
      setSaving(false);
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
    }
  };

  const activeOrgs = organizacoes.filter((org) => org.ativo);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface-plain"
            />
          </div>
          <Select value={statusFiltro} onValueChange={(v) => setStatusFiltro(v as "ativo" | "inativo" | "todos")}>
            <SelectTrigger className="w-36 bg-surface-plain">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          {!isGestor && (
            <Select value={organizacaoFiltro} onValueChange={setOrganizacaoFiltro}>
              <SelectTrigger className="w-48 bg-surface-plain">
                <SelectValue placeholder="Todas as organizações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas organizações</SelectItem>
                {activeOrgs.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Login</TableHead>
              {!isGestor && <TableHead className="hidden md:table-cell">Organização</TableHead>}
              <TableHead className="hidden lg:table-cell">Últ. Sincronização</TableHead>
              <TableHead className="hidden xl:table-cell">Detalhes Sincronização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  {!isGestor && <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>}
                  <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {user.login ?? "-"}
                  </TableCell>
                  {!isGestor && (
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.organizacaoNome ?? "-"}
                    </TableCell>
                  )}
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {user.dataUltimaSincronizacao
                      ? new Date(user.dataUltimaSincronizacao).toLocaleString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell max-w-xs">
                    {user.detalhesUltimaSincronizacao ? (
                      <span
                        title={user.detalhesUltimaSincronizacao}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium truncate block max-w-[200px] ${
                          user.detalhesUltimaSincronizacao.toLowerCase().includes("sucesso")
                            ? "bg-green-100 text-green-800"
                            : user.detalhesUltimaSincronizacao.toLowerCase().includes("conflito") ||
                              user.detalhesUltimaSincronizacao.toLowerCase().includes("não encontrado")
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.detalhesUltimaSincronizacao}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.ativo ? "default" : "secondary"}>
                      {user.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.ativo ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Desativar"
                          onClick={() => handleOpenDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reativar"
                          onClick={() => handleReativar(user)}
                        >
                          <RefreshCcw className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      value={editingUser ? editForm.organizacaoId : createForm.organizacaoId}
                      onValueChange={(value) =>
                        editingUser
                          ? setEditForm({ ...editForm, organizacaoId: value })
                          : setCreateForm({ ...createForm, organizacaoId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma organização" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeOrgs.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <hr/>
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    {editingUser ? "Nova Senha" : "Senha"}
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
                    {editingUser ? "Confirmar Nova Senha" : "Confirmar Senha"}
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
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Desativação</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Tem certeza que deseja desativar o usuário{" "}
            <strong>{deletingUser?.nome}</strong>? O usuário perderá acesso ao sistema.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? "Desativando..." : "Desativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

