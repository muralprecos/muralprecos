import { useState, useCallback } from "react";
import { Building2, Edit, Trash2, Plus, Search, Eye, RefreshCcw, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { KeycloakSyncWarning } from "@/components/atoms/KeycloakSyncWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { MaskedInput } from "@/components/atoms/MaskedInput";
import { toast } from "sonner";
import type { Organizacao, OrganizacaoDetalhes } from "@/interfaces/gestao";

interface OrganizacoesTableProps {
  organizacoes: Organizacao[];
  onSave: (data: Partial<Organizacao> & { cnpj?: string; numero?: string }, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReativar: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const emptyForm = { nome: "", cnpj: "", numero: "" };

export function OrganizacoesTable({
  organizacoes,
  onSave,
  onDelete,
  onReativar,
  isLoading = false,
}: OrganizacoesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"ativo" | "inativo" | "todos">("ativo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetalhesDialogOpen, setIsDetalhesDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organizacao | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<Organizacao | null>(null);
  const [detalhesOrg, setDetalhesOrg] = useState<OrganizacaoDetalhes | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [editKeycloakLoading, setEditKeycloakLoading] = useState(false);
  const [editKeycloakNaoEncontrado, setEditKeycloakNaoEncontrado] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);

  const handleCnpjChange = useCallback(async (raw: string, formatted: string) => {
    setFormData((prev) => ({ ...prev, cnpj: formatted }));
    if (raw.length !== 14) return;
    setCnpjLoading(true);
    try {
      const res = await fetch(`/api/cnpj/${raw}`);
      if (!res.ok) return;
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        cnpj: formatted,
        nome: prev.nome || data.nomeFantasia || data.razaoSocial || prev.nome,
        numero: prev.numero || data.telefone || prev.numero,
      }));
    } catch {
      // lookup falhou — mantém campos como estão
    } finally {
      setCnpjLoading(false);
    }
  }, []);

  const filteredOrgs = organizacoes.filter((org) => {
    const matchNome = org.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" ? org.ativo === true : org.ativo === false);
    return matchNome && matchStatus;
  });

  const handleOpenCreate = () => {
    setEditingOrg(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = async (org: Organizacao) => {
    setEditingOrg(org);
    setFormData({ nome: org.nome, cnpj: "", numero: "" });
    setEditKeycloakLoading(true);
    setEditKeycloakNaoEncontrado(false);
    setIsDialogOpen(true);
    try {
      const res = await fetch(`/api/organizacoes/${org.id}/detalhes`);
      if (res.ok) {
        const data: OrganizacaoDetalhes = await res.json();
        setEditKeycloakNaoEncontrado(data.keycloakNaoEncontrado ?? false);
        setFormData((prev) => ({
          ...prev,
          cnpj: data.cnpj ?? "",
          numero: data.telefone ?? "",
        }));
      }
    } catch {
      // silently ignore — warning simply won't be shown
    } finally {
      setEditKeycloakLoading(false);
    }
  };

  const handleOpenDelete = (org: Organizacao) => {
    setDeletingOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenDetalhes = async (org: Organizacao) => {
    setDetalhesOrg(null);
    setIsDetalhesDialogOpen(true);
    setDetalhesLoading(true);
    try {
      const res = await fetch(`/api/organizacoes/${org.id}/detalhes`);
      if (!res.ok) throw new Error("Erro ao buscar detalhes");
      const data: OrganizacaoDetalhes = await res.json();
      setDetalhesOrg(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar detalhes");
      setIsDetalhesDialogOpen(false);
    } finally {
      setDetalhesLoading(false);
    }
  };

  const handleToggleGestor = async (orgId: string, membroUuid: string, novoStatus: boolean) => {
    try {
      const res = await fetch(`/api/organizacoes/${orgId}/gestores/${membroUuid}`, { 
        method: novoStatus ? "PUT" : "DELETE" 
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Erro na API");
      }
      
      toast.success(novoStatus ? "Privilégios de gestor concedidos" : "Privilégios de gestor removidos");
      setDetalhesOrg((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          membros: prev.membros?.map((m) =>
            m.uuid === membroUuid ? { ...m, isGestor: novoStatus } : m
          ),
        };
      });
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar privilégios do membro");
    }
  };

  const handleSave = async () => {
    if (!formData.nome) {
      toast.error("Nome é obrigatório");
      return;
    }
    setSaving(true);
    try {
      await onSave(
        { nome: formData.nome, cnpj: formData.cnpj || undefined, numero: formData.numero || undefined },
        editingOrg?.id
      );
      toast.success(editingOrg ? "Organização atualizada com sucesso" : "Organização criada com sucesso");
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar organização");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOrg) return;
    setSaving(true);
    try {
      await onDelete(deletingOrg.id);
      toast.success("Organização desativada com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao desativar organização");
    } finally {
      setSaving(false);
      setIsDeleteDialogOpen(false);
      setDeletingOrg(null);
    }
  };

  const handleReativar = async (org: Organizacao) => {
    try {
      await onReativar(org.id);
      toast.success("Organização reativada com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reativar organização");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar organizações..."
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
              <SelectItem value="ativo">Ativas</SelectItem>
              <SelectItem value="inativo">Inativas</SelectItem>
              <SelectItem value="todos">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Organização
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden lg:table-cell">Últ. Sincronização</TableHead>
              <TableHead className="hidden xl:table-cell">Detalhes Sincronização</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden xl:table-cell"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrgs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Nenhuma organização encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.nome}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {org.dataUltimaSincronizacao
                      ? new Date(org.dataUltimaSincronizacao).toLocaleString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell max-w-xs">
                    {org.detalhesUltimaSincronizacao ? (
                      <span
                        title={org.detalhesUltimaSincronizacao}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium truncate block max-w-[200px] ${
                          org.detalhesUltimaSincronizacao.toLowerCase().includes("sucesso")
                            ? "bg-green-100 text-green-800"
                            : org.detalhesUltimaSincronizacao.toLowerCase().includes("conflito") ||
                              org.detalhesUltimaSincronizacao.toLowerCase().includes("não encontrada")
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {org.detalhesUltimaSincronizacao}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={org.ativo ? "default" : "secondary"}>
                      {org.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Visualizar detalhes"
                        onClick={() => handleOpenDetalhes(org)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() => handleOpenEdit(org)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {org.ativo ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Desativar"
                          onClick={() => handleOpenDelete(org)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reativar"
                          onClick={() => handleReativar(org)}
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

      {/* Dialog: Criar / Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingOrg ? "Editar Organização" : "Nova Organização"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingOrg && editKeycloakLoading ? (
              <>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {editingOrg && editKeycloakNaoEncontrado && (
                  <KeycloakSyncWarning message="Organização desincronizada. Alterações podem não ser aplicadas no Keycloak." />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <div className="relative">
                      <MaskedInput
                        mask="cnpj"
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={handleCnpjChange}
                        placeholder="00.000.000/0001-00"
                        disabled={cnpjLoading}
                      />
                      {cnpjLoading && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse">
                          Buscando...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero">Telefone</Label>
                    <MaskedInput
                      mask="phone"
                      id="numero"
                      value={formData.numero}
                      onChange={(_raw, formatted) =>
                        setFormData({ ...formData, numero: formatted })
                      }
                      placeholder="(86) 99999-9999"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Nome da organização"
                  />
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

      {/* Dialog: Confirmar Desativação */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Desativação</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Tem certeza que deseja desativar a organização{" "}
            <strong>{deletingOrg?.nome}</strong>? Todos os usuários membros também serão desativados.
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

      {/* Dialog: Detalhes da Organização */}
      <Dialog open={isDetalhesDialogOpen} onOpenChange={setIsDetalhesDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Organização</DialogTitle>
          </DialogHeader>
          {detalhesLoading ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          ) : detalhesOrg ? (
            <div className="space-y-4 py-2">
              {detalhesOrg.keycloakNaoEncontrado && (
                <KeycloakSyncWarning message="Organização desincronizada. Os atributos e membros podem estar indisponíveis." />
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground block">Nome</span>
                  <span className="font-medium">{detalhesOrg.nome}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status</span>
                  <Badge variant={detalhesOrg.ativo ? "default" : "secondary"}>
                    {detalhesOrg.ativo ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block">CNPJ</span>
                  <span>{detalhesOrg.cnpj ?? "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Telefone</span>
                  <span>{detalhesOrg.telefone ?? "-"}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm block mb-2">
                  Membros ({detalhesOrg.membros?.length ?? 0})
                </span>
                {(detalhesOrg.membros?.length ?? 0) === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum membro cadastrado</p>
                ) : (
                  <div className="rounded-lg border border-border divide-y divide-border">
                    {detalhesOrg.membros?.map((m) => (
                      <div key={m.uuid} className="px-3 py-2 text-sm flex gap-4 items-center">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {m.nome || m.username}
                            {m.isGestor && <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-500 text-amber-600 bg-amber-500/10">Gestor</Badge>}
                          </div>
                          <span className="text-muted-foreground text-xs">{m.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`gestor-${m.uuid}`} className="text-xs text-muted-foreground cursor-pointer">
                            Gestor?
                          </Label>
                          <Switch
                            id={`gestor-${m.uuid}`}
                            checked={m.isGestor}
                            onCheckedChange={(checked) => m.uuid && handleToggleGestor(detalhesOrg.id.toString(), m.uuid, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetalhesDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
