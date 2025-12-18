import { useState } from "react";
import { Building2, Edit, Trash2, Plus, Search } from "lucide-react";
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
import type { Organizacao } from "@/interfaces/gestao";

interface OrganizacoesTableProps {
  organizacoes: Organizacao[];
  onUpdate: (organizacoes: Organizacao[]) => void;
}

const emptyOrg: Omit<Organizacao, "id" | "criadoEm"> = {
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  endereco: "",
  status: "ativa",
};

export function OrganizacoesTable({
  organizacoes,
  onUpdate,
}: OrganizacoesTableProps) {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organizacao | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<Organizacao | null>(null);
  const [formData, setFormData] = useState(emptyOrg);

  const filteredOrgs = organizacoes.filter(
    (org) =>
      org.nome.toLowerCase().includes(search.toLowerCase()) ||
      org.cnpj.includes(search) ||
      org.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingOrg(null);
    setFormData(emptyOrg);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (org: Organizacao) => {
    setEditingOrg(org);
    setFormData({
      nome: org.nome,
      cnpj: org.cnpj,
      email: org.email,
      telefone: org.telefone,
      endereco: org.endereco,
      status: org.status,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (org: Organizacao) => {
    setDeletingOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingOrg) {
      const updated = organizacoes.map((org) =>
        org.id === editingOrg.id ? { ...org, ...formData } : org
      );
      onUpdate(updated);
      toast.success("Organização atualizada com sucesso");
    } else {
      const newOrg: Organizacao = {
        ...formData,
        id: `org-${Date.now()}`,
        criadoEm: new Date().toISOString().split("T")[0],
      };
      onUpdate([...organizacoes, newOrg]);
      toast.success("Organização criada com sucesso");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingOrg) {
      const updated = organizacoes.filter((org) => org.id !== deletingOrg.id);
      onUpdate(updated);
      toast.success("Organização removida com sucesso");
    }
    setIsDeleteDialogOpen(false);
    setDeletingOrg(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar organizações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
              <TableHead>CNPJ</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Telefone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrgs.length === 0 ? (
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
                  <TableCell className="text-muted-foreground">
                    {org.cnpj}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {org.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {org.telefone}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(org)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(org)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
              {editingOrg ? "Editar Organização" : "Nova Organização"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@empresa.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                placeholder="Endereço completo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Tem certeza que deseja excluir a organização{" "}
            <strong>{deletingOrg?.nome}</strong>? Esta ação não pode ser
            desfeita.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
