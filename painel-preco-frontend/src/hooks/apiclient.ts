import { IAPISearchInfo, IRetornoPesquisaItensLicitacao, IUserKeyCloakRequest } from "@/interfaces/types";
import { getValParamSearch } from "@/utils/searchParamUtils";


const apiClientGenericGetList = async (attr: string, obj: string, info : IAPISearchInfo[]) => {
  const nome = getValParamSearch(info, attr);
  const res = await fetch(`/api/autocomplete/obj/${obj}/param/${attr}/info/${nome}`);
  const data = await res.json();
  return data;
}

export const apiClientGetListOrgaos = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'orgaos', info);
}

export const apiClientGetListOrgaosSuperiores = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'orgaos-superiores', info);
}

export const apiClientGetListFornecedores = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'fornecedores', info);
}

export const apiClientGetListNomeMaterial = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'nome-material', info);
}

export const apiClientGetListUASG = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'unidade-gestora', info);
}

export const apiClientGetListUnidadesFornecimento = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('nome', 'unidade-fornecimento', info);
}

//UNUSED
export const apiClientGetListDescricao = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('descricao', 'descricao', info);
}

//UNUSED
export const apiClientGetListDescricaoComplementar = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('descricaoComplementar', 'descricao-complementar', info);
}

//UNUSED
export const apiClientGetListObjetoCompra = async (info : IAPISearchInfo[]) => {
  return apiClientGenericGetList('objeto', 'objeto-compra', info);
}

export const apiClientGetListMunicipios = async (info : IAPISearchInfo[]) => {
  const uuiduf = getValParamSearch(info, 'uuiduf');
  const nome = getValParamSearch(info, 'nome');

  const res = await fetch(`/api/autocomplete/unidades-federativas/${uuiduf}/municipios/${nome}`);
  const data = await res.json();
  return data;
}

export const apiClientGetItemCotacao = async (info : IAPISearchInfo[]) => {
  const uuid = getValParamSearch(info, 'uuid');

  const res = await fetch(`/api/cotacao/ver-item/${uuid}`);
  const data = await res.json();
  return data;
}

export const apiClientPostSearchListItens = async (info : IAPISearchInfo[]) => {
  const res = await fetch(`/api/cotacao/listar-items`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: info
    })
  });
  const data = await res.json();
  return data;
}

export const apiClientGetItemHistorico = async (info : IAPISearchInfo[]) => {
  const uuid = getValParamSearch(info, 'uuid');

  const res = await fetch(`/api/cotacao/ver-historico/${uuid}`);
  const data = await res.json();
  return data;
}

export const apiClientPostSearchHistoricoCotacoes = async (size : number, info : IAPISearchInfo[]) => {
  const res = await fetch(`/api/cotacao/listar-historico`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      size,
      info: info
    })
  });
  const data = await res.json();
  return data;
}

export const apiClientPostGerarPDFCotacao = async (cart : IRetornoPesquisaItensLicitacao[]) => {
  const res = await fetch(`/api/carrinho/gerar-cotacao`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cart
    })
  });
  const data = await res.blob();
  return data;
}

export const apiClientPostUserUpdate = async (user : IUserKeyCloakRequest) => {
  const res = await fetch(`/api/user/update`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const data = await res.json();
  return data;
}