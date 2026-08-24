export interface FornecedorKpi {
  totalFornecedores: number;
  totalContratos: number;
  valorTotal: number;
  fornecedoresMes: number;
  fornecedoresMesVariacao: number;
  valorMes: number;
  valorMesVariacao: number;
}

export interface FornecedorRankingItem {
  documento: string;
  nome: string;
  porte: string;
  totalContratos: number;
  valorTotal: number;
}

export interface FornecedorPorteItem {
  porte: string;
  totalFornecedores: number;
  totalContratos: number;
  valorTotal: number;
}

export interface FornecedorEvolucaoItem {
  mesAno: string;
  totalFornecedores: number;
  totalContratos: number;
  valorTotal: number;
}
