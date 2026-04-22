export interface Organizacao {
  id: string;
  uuid?: string;
  nome: string;
  ativo: boolean;
  dataCriacao?: string;
}

export interface OrganizacaoDetalhes extends Organizacao {
  cnpj?: string;
  telefone?: string;
  membros?: MembroOrganizacao[];
  keycloakNaoEncontrado?: boolean;
}

export interface MembroOrganizacao {
  uuid?: string;
  username?: string;
  nome?: string;
  email?: string;
}

export interface Usuario {
  id: string;
  uuid?: string;
  login?: string;
  nome: string;
  email?: string;
  organizacaoId?: string;
  organizacaoNome?: string;
  ativo: boolean;
  dataCriacao?: string;
  keycloakNaoEncontrado?: boolean;
}

