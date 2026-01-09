export interface Organizacao {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "ativa" | "inativa";
  criadoEm: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  organizacaoId: string;
  organizacaoNome: string;
  status: "ativo" | "inativo";
  criadoEm: string;
}
