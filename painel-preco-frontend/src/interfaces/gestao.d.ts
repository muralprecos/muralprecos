export interface Organizacao {
  id: string;
  uuid?: string;
  nome: string;
  ativo: boolean;
  dataCriacao?: string;
  detalhesUltimaSincronizacao?: string;
  dataUltimaSincronizacao?: string;
  usuarioSincronizacaoId?: number;
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
  isGestor?: boolean;
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
  detalhesUltimaSincronizacao?: string;
  dataUltimaSincronizacao?: string;
  usuarioSincronizacaoId?: number;
}

export interface SincronizacaoResultado {
  usuariosDesativados: number;
  usuariosReativados: number;
  usuariosCriados: number;
  usuariosComConflito: number;
  usuariosNaoAlterados: number;
  organizacoesDesativadas: number;
  organizacoesReativadas: number;
  organizacoesCriadas: number;
  organizacoesComConflito: number;
  organizacoesNaoAlteradas: number;
  mensagens: string[];
}

