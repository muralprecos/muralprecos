export interface AtaKpi {
  totalAtasAtivas: number;
  atasVencendo30d: number;
  valorTotalRegistrado: number;
  totalItensCobertos: number;
}

export interface AtaSituacaoItem {
  situacao: string;
  total: number;
}

export interface AtaEvolucaoItem {
  mesAno: string;
  criadas: number;
  encerradas: number;
  ativas: number;
}

export interface AtaTopObjetoItem {
  descricao: string;
  totalAtas: number;
  valorTotal: number;
}

export interface AtaAlertaVencimento {
  numeroPncp: string;
  orgaoGerenciador: string;
  objeto: string;
  dataVigenciaFim: string;
  diasRestantes: number;
  valorTotal: number;
}
