export interface DashboardResumo {
  licitacoesMes: number;
  licitacoesMesComparacao: number | string;
  cotacoesCriadas: number;
  cotacoesCriadasComparacao: string | number;
  valorMedioCotacao: number;
  valorMedioCotacaoComparacao: number | string;
}

export interface DadosMensais {
  mes: string;
  volumeLicitacoes: number;
  valorCotacoes: number;
}

export interface DashboardGraficos {
  dadosMensais: DadosMensais[];
}

export interface Licitacao {
  uuid: string;
  numero: string;
  objeto: string;
  dataAbertura: string | null;
  status: string;
  valor: number;
}

export interface Cotacao {
  uuid: string;
  nome: string;
  criadoEm: string;
  status: string | null;
  valor: number | null;
}

export interface DashboardData {
  resumo: DashboardResumo;
  graficos: DashboardGraficos;
  ultimasLicitacoes: { content: Licitacao[] };
  ultimasCotacoes: { content: Cotacao[] };
}
