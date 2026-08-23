import { useEffect, useMemo, useState } from "react";
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
  getNomeMaterialDesc,
  getOrgaoDesc,
  getUASGDesc,
  getUnidadeFornecimentoDesc,
} from "@/hooks/api";
import {
  IFornecedor,
  IMunicipio,
  INomeMaterial,
  IObjetoAPI,
  IOrgao,
  IUnidadeGestora,
  type IItemSelect,
} from "@/interfaces/types";
import type { FieldsForms } from "@/app/(system)/cotacoes/realizar-cotacao/_components/utils";

type Props = {
  ufId?: string;
  anosCompras: IItemSelect[];
  empresaPorte: IItemSelect[];
  esferas: IItemSelect[];
  compraFormas: IItemSelect[];
  compraModalidades: IItemSelect[];
  compraPeriodos: IItemSelect[];
  situacoesLicitacoes: IItemSelect[];
  unidadesFederativas: IItemSelect[];
};

export function useCotacaoFields({
  ufId,
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
}: Props): FieldsForms {
  const hasUF = ufId != null && ufId !== "";

  const [municipios, setMunicipios] = useState<IItemSelect[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  useEffect(() => {
    if (!ufId) {
      setMunicipios([]);
      setLoadingMunicipios(false);
      return;
    }

    let active = true;
    const fetchMunicipios = async () => {
      setLoadingMunicipios(true);
      try {
        let currentPage = 0;
        let allMunicipios: IMunicipio[] = [];
        let totalElements = 0;

        do {
          const res = await apiClientGetListMunicipios([
            { param: "uuiduf", val: ufId },
            { param: "nome", val: "" },
            { param: "page", val: String(currentPage) },
            { param: "size", val: "50" },
          ]);

          if (active && res) {
            if (Array.isArray(res.content)) {
              allMunicipios = allMunicipios.concat(res.content);
            }
            totalElements = res.totalElements ?? 0;
          } else {
            break;
          }

          currentPage++;
        } while (active && allMunicipios.length < totalElements && totalElements > 0);

        if (active) {
          const items = allMunicipios.map((m: IMunicipio) => ({
            value: m.uuid,
            label: m.nome,
          }));
          setMunicipios(items);
        }
      } catch (error) {
        console.error("Erro ao buscar municípios:", error);
        if (active) {
          setMunicipios([]);
        }
      } finally {
        if (active) {
          setLoadingMunicipios(false);
        }
      }
    };

    fetchMunicipios();

    return () => {
      active = false;
    };
  }, [ufId]);

  const autoOrgaoSuperior = useAutocompleteFilter<IOrgao>({
    getList: apiClientGetListOrgaosSuperiores,
  });

  const autoOrgao = useAutocompleteFilter<IOrgao>({
    getList: apiClientGetListOrgaos,
  });

  const autoFornecedor = useAutocompleteFilter<IFornecedor>({
    params: ["nome"],
    getList: apiClientGetListFornecedores,
  });

  const autoMaterial = useAutocompleteFilter<INomeMaterial>({
    getList: apiClientGetListNomeMaterial,
  });

  const autoUG = useAutocompleteFilter<IUnidadeGestora>({
    getList: apiClientGetListUASG,
  });

  const autoUnidadeFornecimento = useAutocompleteFilter<IObjetoAPI>({
    getList: apiClientGetListUnidadesFornecimento,
  });

  const fields = useMemo<FieldsForms>(
    () => ({
      ano: {
        type: "autocompletStatic",
        label: "Ano da Compra",
        items: anosCompras,
      },
      porteFornecedorId: {
        type: "autocompletStatic",
        label: "Porte da Empresa",
        items: empresaPorte,
      },
      esferaId: {
        type: "autocompletStatic",
        label: "Esfera",
        items: esferas,
      },
      formaCompraId: {
        type: "autocompletStatic",
        label: "Modo de Disputa",
        items: compraFormas,
      },
      modalidadeId: {
        type: "autocompletStatic",
        label: "Modalidade Compra",
        items: compraModalidades,
      },
      periodoCompraId: {
        type: "autocompletStatic",
        label: "Período da Compra *",
        items: compraPeriodos,
        disableSorting: true,
      },
      situacaoId: {
        type: "autocompletStatic",
        label: "Situação da Licitação",
        items: situacoesLicitacoes,
      },
      regiao: {
        type: "autocompletStatic",
        label: "Região",
        items: [
          { value: "Norte", label: "Norte" },
          { value: "Nordeste", label: "Nordeste" },
          { value: "Centro-Oeste", label: "Centro-Oeste" },
          { value: "Sul", label: "Sul" },
          { value: "Sudeste", label: "Sudeste" }
        ],
      },
      ufId: {
        type: "autocompletStatic",
        label: "Unidade Federativa",
        items: unidadesFederativas,
      },
      municipioId: {
        type: "autocompletStatic",
        label: "Município",
        items: municipios,
        disableSorting: false,
        isLoading: loadingMunicipios,
        isDisabled: !hasUF,
      },
      orgaoSuperiorId: {
        type: "autocompleteAsync",
        label: "Orgão Superior",
        auto: {
          async: autoOrgaoSuperior,
          attrVal: "uuid",
          apiFindDesc: getOrgaoDesc,
        },
      },
      orgaoId: {
        type: "autocompleteAsync",
        label: "Orgão",
        auto: {
          async: autoOrgao,
          attrVal: "uuid",
          apiFindDesc: getOrgaoDesc,
        },
      },
      fornecedorId: {
        type: "autocompleteAsync",
        label: "Fornecedor",
        auto: {
          async: autoFornecedor,
          attrVal: "uuid",
          apiFindDesc: getFornecedorDesc,
        },
      },
      materialId: {
        type: "autocompleteAsync",
        label: "Nome/Código Material",
        auto: {
          async: autoMaterial,
          attrVal: "uuid",
          apiFindDesc: getNomeMaterialDesc,
        },
      },
      ugId: {
        type: "autocompleteAsync",
        label: "Unidade Gestora (UASG)",
        auto: {
          async: autoUG,
          attrVal: "uuid",
          apiFindDesc: getUASGDesc,
        },
      },
      unidadeFornecimentoId: {
        type: "autocompleteAsync",
        label: "Unidade de Fornecimento",
        auto: {
          async: autoUnidadeFornecimento,
          attrVal: "uuid",
          apiFindDesc: getUnidadeFornecimentoDesc,
        },
      },
    }),
    [
      anosCompras,
      empresaPorte,
      esferas,
      compraFormas,
      compraModalidades,
      compraPeriodos,
      situacoesLicitacoes,
      unidadesFederativas,
      municipios,
      loadingMunicipios,
      autoOrgaoSuperior,
      autoOrgao,
      autoFornecedor,
      autoMaterial,
      autoUG,
      autoUnidadeFornecimento,
      hasUF,
    ],
  );

  return fields;
}
