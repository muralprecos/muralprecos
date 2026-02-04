import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";
import {
  apiClientGetListFornecedores,
  apiClientGetListMunicipios,
  apiClientGetListNomeMaterial,
  apiClientGetListOrgaos,
  apiClientGetListOrgaosSuperiores,
  apiClientGetListUASG,
  apiClientGetListUnidadesFornecimento,
} from "@/hooks/apiclient";
import {
  getFornecedorDesc,
  getOrgaoDesc,
  getNomeMaterialDesc,
  getUASGDesc,
  getUnidadeFornecimentoDesc,
} from "@/hooks/api";
import {
  IItemSelect,
  IMunicipio,
  IOrgao,
  IFornecedor,
  INomeMaterial,
  IUnidadeGestora,
  IObjetoAPI,
} from "@/interfaces/types";

export function useFieldsCotacaoForm({
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  ufId,
  hasUF,
}: {
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
  ufId: string | undefined;
  hasUF: () => boolean;
}) {
  const municipioFilter = useAutocompleteFilter<IMunicipio>({
    minCharactersLoad: 0,
    params: ["nome"],
    getList: apiClientGetListMunicipios,
    infos: ufId ? [{ val: ufId, param: "uuiduf" }] : [],
  });

  const orgaoSuperiorFilter = useAutocompleteFilter<IOrgao>({
    getList: apiClientGetListOrgaosSuperiores,
  });

  const orgaoFilter = useAutocompleteFilter<IOrgao>({
    getList: apiClientGetListOrgaos,
  });

  const fornecedorFilter = useAutocompleteFilter<IFornecedor>({
    params: ["nome"],
    getList: apiClientGetListFornecedores,
  });

  const materialFilter = useAutocompleteFilter<INomeMaterial>({
    getList: apiClientGetListNomeMaterial,
  });

  const ugFilter = useAutocompleteFilter<IUnidadeGestora>({
    getList: apiClientGetListUASG,
  });

  const unidadeFornecimentoFilter = useAutocompleteFilter<IObjetoAPI>({
    getList: apiClientGetListUnidadesFornecimento,
  });

  return {
    ano: {
      type: "autocompletStatic",
      label: "Ano da Compra",
      items: anosCompras,
    },
    porteFornecedor: {
      type: "autocompletStatic",
      label: "Porte da Empresa",
      items: empresaPorte,
    },
    esferaId: { type: "autocompletStatic", label: "Esfera", items: esferas },
    formaCompraId: {
      type: "autocompletStatic",
      label: "Modo de Disputa",
      items: compraFormas,
    },
    modalidadeCompraId: {
      type: "autocompletStatic",
      label: "Modalidade Compra",
      items: compraModalidades,
    },
    periodoCompraId: {
      type: "autocompletStatic",
      label: "Período da Compra",
      items: compraPeriodos,
    },
    situacao_licitacao: {
      type: "autocompletStatic",
      label: "Situação da Licitação",
      items: situacoesLicitacoes,
    },
    ufId: {
      type: "autocompletStatic",
      label: "Unidade Federativa",
      items: unidadesFederativas,
    },

    municipioId: {
      type: "autocompleteAsync",
      label: "Município",
      auto: {
        async: municipioFilter,
        attrVal: "uuid",
        isDisabled: !hasUF(),
      },
    },
    orgaoSuperiorId: {
      type: "autocompleteAsync",
      label: "Orgão Superior",
      auto: {
        async: orgaoSuperiorFilter,
        attrVal: "uuid",
        apiFindDesc: getOrgaoDesc,
      },
    },
    orgaoId: {
      type: "autocompleteAsync",
      label: "Orgão",
      auto: {
        async: orgaoFilter,
        attrVal: "uuid",
        apiFindDesc: getOrgaoDesc,
      },
    },
    fornecedorId: {
      type: "autocompleteAsync",
      label: "Fornecedor",
      auto: {
        async: fornecedorFilter,
        attrVal: "uuid",
        apiFindDesc: getFornecedorDesc,
      },
    },
    materialId: {
      type: "autocompleteAsync",
      label: "Nome/Código Material",
      auto: {
        async: materialFilter,
        attrVal: "uuid",
        apiFindDesc: getNomeMaterialDesc,
      },
    },
    ugId: {
      type: "autocompleteAsync",
      label: "UASG",
      auto: {
        async: ugFilter,
        attrVal: "uuid",
        apiFindDesc: getUASGDesc,
      },
    },
    unidade_fornecimento: {
      type: "autocompleteAsync",
      label: "Unidade de Medida",
      auto: {
        async: unidadeFornecimentoFilter,
        attrVal: "uuid",
        apiFindDesc: getUnidadeFornecimentoDesc,
      },
    },
  };
}
