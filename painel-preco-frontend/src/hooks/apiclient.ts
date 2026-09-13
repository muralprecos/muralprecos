import {
  IAPISearchInfo,
  IArtefatoGerado,
  IArtefatoSecaoLog,
  IConversationIAHistory,
  IProcessoContratacao,
  IProcessoContratacaoForm,
  IRetornoPesquisaItensLicitacao,
  IUserKeyCloakRequest,
  TipoArtefatoEnum,
} from "@/interfaces/types";
import { getValParamSearch } from "@/utils/searchParamUtils";

const apiClientGenericGetList = async (
  attr: string,
  obj: string,
  info: IAPISearchInfo[]
) => {
  const nome = getValParamSearch(info, attr);
  const res = await fetch(
    `/api/autocomplete/obj/${obj}/param/${attr}/info/${nome}`
  );
  const data = await res.json();
  return data;
};

export const apiClientGetListOrgaos = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("nome", "orgaos", info);
};

export const apiClientGetListOrgaosSuperiores = async (
  info: IAPISearchInfo[]
) => {
  return apiClientGenericGetList("nome", "orgaos-superiores", info);
};

export const apiClientGetListFornecedores = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("nome", "fornecedores", info);
};

export const apiClientGetListNomeMaterial = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("nome", "nome-material", info);
};

export const apiClientGetListUASG = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("nome", "unidade-gestora", info);
};

export const apiClientGetListUnidadesFornecimento = async (
  info: IAPISearchInfo[]
) => {
  return apiClientGenericGetList("nome", "unidade-fornecimento", info);
};

export const apiClientGetListDescricao = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("descricao", "descricao", info);
};

export const apiClientGetListDescricaoComplementar = async (
  info: IAPISearchInfo[]
) => {
  return apiClientGenericGetList(
    "descricaoComplementar",
    "descricao-complementar",
    info
  );
};

export const apiClientGetListObjetoCompra = async (info: IAPISearchInfo[]) => {
  return apiClientGenericGetList("objeto", "objeto-compra", info);
};

export const apiClientGetListMunicipios = async (info: IAPISearchInfo[]) => {
  const uuiduf = getValParamSearch(info, "uuiduf");
  const nome = getValParamSearch(info, "nome");
  const page = getValParamSearch(info, "page");
  const size = getValParamSearch(info, "size");

  const searchParams = new URLSearchParams();
  if (page) searchParams.set("page", page);
  if (size) searchParams.set("size", size);
  const queryStr = searchParams.toString();

  const url = `/api/autocomplete/unidades-federativas/${uuiduf}/municipios/${nome}${
    queryStr ? `?${queryStr}` : ""
  }`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const apiClientGetItemCotacao = async (info: IAPISearchInfo[]) => {
  const uuid = getValParamSearch(info, "uuid");
  if (!uuid || uuid === "undefined") {
    console.error("UUID ausente ou inválido em apiClientGetItemCotacao", info);
    return null;
  }

  const res = await fetch(`/api/cotacao/ver-item/${uuid}`);
  const data = await res.json();
  return data;
};

export const apiClientPostSearchListItens = async (info: IAPISearchInfo[]) => {
  const res = await fetch(`/api/cotacao/listar-items`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: info,
    }),
  });
  const data = await res.json();
  return data;
};

export const apiClientGetItemHistorico = async (info: IAPISearchInfo[]) => {
  const uuid = getValParamSearch(info, "uuid");

  const res = await fetch(`/api/cotacao/ver-historico/${uuid}`);
  const data = await res.json();
  return data;
};

export const apiClientPostSearchHistoricoCotacoes = async (
  size: number,
  info: IAPISearchInfo[]
) => {
  const res = await fetch(`/api/cotacao/listar-historico`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      size,
      info: info,
    }),
  });
  const data = await res.json();
  return data;
};

export const apiClientPostGerarPDFCotacao = async (
  cart: IRetornoPesquisaItensLicitacao[]
) => {
  const res = await fetch(`/api/carrinho/gerar-cotacao`, {
    method: "POST",
    headers: {
      Accept: "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart,
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.message || "Não foi possível gerar o arquivo da cotação");
  }
  const data = await res.blob();
  return data;
};

export const apiClientPostGerarProcessoContratacaoDoCarrinho = async (
  cart: IRetornoPesquisaItensLicitacao[]
): Promise<string> => {
  const res = await fetch(`/api/carrinho/gerar-processo-contratacao`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message || "Não foi possível gerar o processo de contratação"
    );
  }
  return data.cotacaoUuid as string;
};

export const apiClientPostCreateProcessoContratacao = async (
  form: IProcessoContratacaoForm
): Promise<IProcessoContratacao> => {
  const res = await fetch(`/api/processos-contratacao`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Não foi possível criar o processo de contratação");
  }
  return data as IProcessoContratacao;
};

export const apiClientGetProcessoContratacao = async (
  uuid: string
): Promise<IProcessoContratacao> => {
  const res = await fetch(`/api/processos-contratacao/${uuid}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Não foi possível carregar o processo de contratação");
  }
  return data as IProcessoContratacao;
};

/** @return o processo já existente para esta cotação, ou null se nenhum foi criado ainda. */
export const apiClientGetProcessoContratacaoPorCotacao = async (
  cotacaoUuid: string
): Promise<IProcessoContratacao | null> => {
  const res = await fetch(`/api/processos-contratacao/por-cotacao/${cotacaoUuid}`);
  if (res.status === 404) {
    return null;
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Não foi possível verificar processos existentes para esta cotação");
  }
  return data as IProcessoContratacao;
};

export const apiClientPutAtualizarProcessoContratacao = async (
  uuid: string,
  form: IProcessoContratacaoForm
): Promise<IProcessoContratacao> => {
  const res = await fetch(`/api/processos-contratacao/${uuid}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Não foi possível atualizar o processo de contratação");
  }
  return data as IProcessoContratacao;
};

export const apiClientPostGerarArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum
): Promise<IArtefatoGerado> => {
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/gerar`,
    { method: "POST" }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Não foi possível gerar o ${tipo}`);
  }
  return data as IArtefatoGerado;
};

export const apiClientPostRevisarArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number
): Promise<IArtefatoGerado> => {
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/revisar`,
    { method: "POST" }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Não foi possível marcar o ${tipo} como revisado`);
  }
  return data as IArtefatoGerado;
};

export const apiClientGetLogSecoesArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number
): Promise<IArtefatoSecaoLog[]> => {
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/log-secoes`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Não foi possível carregar o log de seções");
  }
  return data as IArtefatoSecaoLog[];
};

export const apiClientGetDownloadArtefato = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number
): Promise<{ blob: Blob; filename: string | null }> => {
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/download`
  );
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.message || `Não foi possível baixar o ${tipo}`);
  }
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition ? /filename="?([^"]+)"?/.exec(disposition) : null;
  const blob = await res.blob();
  return { blob, filename: match ? match[1] : null };
};

export const apiClientPostUploadArtefatoFinal = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number,
  arquivo: File
): Promise<IArtefatoGerado> => {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/arquivo-final`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Não foi possível enviar a versão final do ${tipo}`);
  }
  return data as IArtefatoGerado;
};

export const apiClientGetDownloadArtefatoFinal = async (
  uuid: string,
  tipo: TipoArtefatoEnum,
  versao: number
): Promise<{ blob: Blob; filename: string | null }> => {
  const res = await fetch(
    `/api/processos-contratacao/${uuid}/artefatos/${tipo.toLowerCase()}/versoes/${versao}/arquivo-final/download`
  );
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.message || `Não foi possível baixar a versão final do ${tipo}`);
  }
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition ? /filename="?([^"]+)"?/.exec(disposition) : null;
  const blob = await res.blob();
  return { blob, filename: match ? match[1] : null };
};

export const apiClientPostUserUpdate = async (user: IUserKeyCloakRequest) => {
  const res = await fetch(`/api/user/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  return data;
};

export const apiClientConversationIA = async (
  conversationHistory: IConversationIAHistory[],
  ia: "deepseek" | "grok" | "openai" = "deepseek"
) => {
  const res = await fetch(`/api/ia/${ia}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation_history: conversationHistory }),
  });
  const data = await res.json();
  return data;
};
