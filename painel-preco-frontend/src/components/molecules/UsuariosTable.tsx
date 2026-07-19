import { useState } from "react";
import { Users, Edit, Trash2, Plus, Search, RefreshCcw } from "lucide-react";
import { SortIcon } from "@/components/atoms/SortIcon";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Organizacao, Usuario } from "@/interfaces/gestao";
import { UsuarioFormDialog } from "./UsuarioFormDialog";

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
  const [sortConfig, setSortConfig] = useState<{ key: "nome" | "login" | "organizacaoNome", direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: "nome" | "login" | "organizacaoNome") => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const filteredUsers = usuarios.filter((user) => {
    const term = search.toLowerCase();
    const matchNome =
      user.nome.toLowerCase().includes(term) ||
      (user.email ?? "").toLowerCase().includes(term) ||
      (user.organizacaoNome ?? "").toLowerCase().includes(term);
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" ? user.ativo === true : user.ativo === false);
    const matchOrg = organizacaoFiltro === "todas" || user.organizacaoId?.toString() === organizacaoFiltro;
    return matchNome && matchStatus && matchOrg;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = (a[sortConfig.key] || "").toLowerCase();
    const bValue = (b[sortConfig.key] || "").toLowerCase();
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (user: Usuario) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
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
    try {
      await onDelete(deletingUser.id);
      toast.success("Usuário desativado com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover usuário");
    } finally {
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
                  <SelectItem key={org.id.toString()} value={org.id.toString()}>
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
              <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                Nome <SortIcon direction={sortConfig?.key === "nome" ? sortConfig.direction : null} />
              </TableHead>
              <TableHead className="hidden sm:table-cell cursor-pointer" onClick={() => handleSort("login")}>
                Login <SortIcon direction={sortConfig?.key === "login" ? sortConfig.direction : null} />
              </TableHead>
              <TableHead className="hidden xl:table-cell">E-mail</TableHead>
              {!isGestor && (
                <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("organizacaoNome")}>
                  Organização <SortIcon direction={sortConfig?.key === "organizacaoNome" ? sortConfig.direction : null} />
                </TableHead>
              )}
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
                  <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  {!isGestor && <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>}
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isGestor ? 5 : 6}
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
                  <TableCell className="hidden xl:table-cell text-muted-foreground max-w-[200px] truncate">
                    {user.email ?? "-"}
                  </TableCell>
                  {!isGestor && (
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.organizacaoNome ?? "-"}
                    </TableCell>
                  )}
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

      <UsuarioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        organizacoes={organizacoes}
        onSave={onSave}
        isGestor={isGestor}
      />

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
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

