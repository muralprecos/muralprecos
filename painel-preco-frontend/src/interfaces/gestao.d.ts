export interface Organizacao {
  id: string;
  uuid?: string;
  nome: string;
  cnpj?: string;
  numero?: string;
  ativo: boolean;
  dataCriacao?: string;
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
}

