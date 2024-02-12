'use client'

import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import yupStrings from '@/utils/yupStrings';
import { Button } from '@nextui-org/react'
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { IFornecedor, IItemDescricao, IItemSelect, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, ISimpleObjetoAPI, IUnidadeGestora } from "@/interfaces/types";
import { getListFornecedores, getListMunicipios, getListNomeMaterial, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento, getListObjetosCompras, getListDescricao, FIELDS_COTACOES_LIST, getFornecedorDesc, getOrgaoDesc, getNomeMaterialDesc, getUASGDesc, getUnidadeFornecimentoDesc } from "@/hooks/api";
import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";

import FormRow from "@/components/atoms/FormRow";
import AutocompleteForm from '@/components/molecules/AutocompleteForm';
import AutocompleteAsyncForm from '@/components/molecules/AutocompleteAsyncForm';
import SelectForm from '@/components/molecules/SelectForm';
import { objToParamSearch } from '@/utils/searchParamUtils';
import { useAppSelector, useDispatch } from '@/redux/store';
import { doSearch, initialFormData } from '@/redux/features/cotacao-search-slice';
import { isClientNextjs } from '@/utils/validateUtils';
import { ReadonlyURLSearchParams, useRouter } from 'next/navigation';
import { mountUrl } from '@/utils/requestUtils';
import { AsyncListData } from '@react-stately/data';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export interface IPropsSearchItensLicitacaoForm {
  searchParams?: ReadonlyURLSearchParams
  anosCompras: IItemSelect[]
  empresaPorte: IItemSelect[]
  esferas: IItemSelect[]
  compraFormas: IItemSelect[]
  compraModalidades: IItemSelect[]
  compraPeriodos: IItemSelect[]
  situacoesLicitacoes: IItemSelect[]
  unidadesFederativas: IItemSelect[]
}

const schema = yup.object({
  ano: yup.string(),
  porteFornecedor: yup.string(),
  esferaId: yup.string(),
  formaCompraId: yup.string(),
  modalidadeCompraId: yup.string(),
  periodoCompraId: yup.string().required(yupStrings.required),

  ufId: yup.string().nullable(),
  municipioId: yup.string().nullable(),
  orgaoSuperiorId: yup.string().nullable(),
  orgaoId: yup.string().nullable(),
  fornecedorId: yup.string().nullable(),
  materialId: yup.string().nullable(),
  ugId: yup.string().nullable(),
  objeto: yup.string().nullable(),
  descricao: yup.string().nullable(),
  descricaoComplementar: yup.string().nullable(),

  situacao_licitacao: yup.string(),
  unidade_fornecimento: yup.string().nullable(),
});
export type FormDataCotacao = yup.InferType<typeof schema>;
type FieldAutocompleteAsync<T extends ISimpleObjetoAPI> = {
  async: AsyncListData<T>
  attrVal: 'uuid' | 'nome'
  isDisabled?: boolean
  apiFindDesc?: (uuid: string) => Promise<string|null>
}
type FieldFormSelect = {
  type: 'select'
  label: string
  items: IItemSelect[]
};
type FieldFormAutocompleteStatic = {
  type: 'autocompletStatic'
  label: string
  items: IItemSelect[]
};
type FieldFormAutocompleteAsync = {
  type: 'autocompleteAsync'
  label: string
  auto: FieldAutocompleteAsync<any>
};
type FieldFormTypes = FieldFormSelect | FieldFormAutocompleteStatic | FieldFormAutocompleteAsync;
type FieldsForms = {
  [K in keyof FormDataCotacao]: FieldFormTypes
}

const SearchItensLicitacaoForm: React.FC<IPropsSearchItensLicitacaoForm> = ({
  searchParams,
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  ...opts
}) => {

  const router = useRouter();
  const { status, token } = useAuthCheck();

  const dispatch = useDispatch();
  const _initialFormDataLocalStorage: FormDataCotacao = useAppSelector((state) => state.cotacaoSearchReducer.value);

  const [lastUF, setLastUF] = useState<string|null>();
  const {
    control,
    handleSubmit,
    watch,
    resetField,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormDataCotacao>({
    resolver: yupResolver(schema),
    defaultValues: initialFormData
  });
  const ufId = watch("ufId");
  const hasUF = useCallback(() => {
    return ufId != undefined && ufId != '';
  }, [ufId]);

  const onSubmit: SubmitHandler<FormDataCotacao> = async (data) => {
    //armazenar dados da busca no redux
    dispatch(doSearch(data));
    const info = objToParamSearch(data);
    router.push(mountUrl({
      host: '',
      path: '/cotacao/listagem',
      page: 0,
      size: 20,
      info,
      filterFields: FIELDS_COTACOES_LIST
    }));
  }
  const onSubmitError: SubmitErrorHandler<FormDataCotacao> = (data) => {
    //TODO: lançar erro ao dar problema na requisição
    //console.log(data)
  }

  const fields : FieldsForms = {
    ano: { type: 'select', label: 'Ano da Compra', items: anosCompras },
    porteFornecedor: { type: 'select', label: 'Porte da Empresa', items: empresaPorte },
    esferaId: { type: 'select', label: 'Esfera', items: esferas },
    formaCompraId: { type: 'select', label: 'Forma da Compra', items: compraFormas },
    modalidadeCompraId: { type: 'select', label: 'Modalidade Compra', items: compraModalidades },
    periodoCompraId: { type: 'select', label: 'Período da Compra', items: compraPeriodos },

    situacao_licitacao: { type: 'autocompletStatic', label: 'Situação da Licitação', items: situacoesLicitacoes },
    ufId: { type: 'autocompletStatic', label: 'Unidade Federativa', items: unidadesFederativas },

    municipioId: { type: 'autocompleteAsync', label: 'Município', auto: {
      async: useAutocompleteFilter<IMunicipio>({
        minCharactersLoad: 0,
        getList: getListMunicipios,
        infos: ufId ? [{ val: ufId, param: 'uuiduf' }] : [],
        accessToken: token
      }),
      attrVal: "uuid",
      isDisabled: !hasUF()
    }},
    orgaoSuperiorId: { type: 'autocompleteAsync', label: 'Orgão Superior', auto: {
      async: useAutocompleteFilter<IOrgao>({ getList: getListOrgaosSuperiores, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getOrgaoDesc
    }},
    orgaoId: { type: 'autocompleteAsync', label: 'Orgão', auto: {
      async: useAutocompleteFilter<IOrgao>({ getList: getListOrgaos, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getOrgaoDesc
    }},
    fornecedorId: { type: 'autocompleteAsync', label: 'Fornecedor', auto: {
      async: useAutocompleteFilter<IFornecedor>({ params: ['nome'], getList: getListFornecedores, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getFornecedorDesc
    }},
    materialId: { type: 'autocompleteAsync', label: 'Nome/Código Material', auto: {
      async: useAutocompleteFilter<INomeMaterial>({ getList: getListNomeMaterial, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getNomeMaterialDesc
    }},
    ugId: { type: 'autocompleteAsync', label: 'Unidade Gestora', auto: {
      async: useAutocompleteFilter<IUnidadeGestora>({ getList: getListUASG, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getUASGDesc
    }},
    unidade_fornecimento: { type: 'autocompleteAsync', label: 'Unidade de Fornecimento', auto: {
      async: useAutocompleteFilter<IObjetoAPI>({ getList: getListUnidadesFornecimento, accessToken: token }),
      attrVal: "uuid",
      apiFindDesc: getUnidadeFornecimentoDesc
    }},
    descricao: { type: 'autocompleteAsync', label: 'Descrição', auto: {
      async: useAutocompleteFilter<IItemDescricao>({ params: ['descricao'], getList: getListDescricao, accessToken: token }),
      attrVal: "nome"
    }},
    descricaoComplementar: { type: 'autocompleteAsync', label: 'Descrição Complementar', auto: {
      async: useAutocompleteFilter<IItemDescricao>({ params: ['descricaoComplementar'], getList: getListDescricao, accessToken: token }),
      attrVal: "nome"
    }},
    objeto: { type: 'autocompleteAsync', label: 'Objeto da Comprar', auto: {
      async: useAutocompleteFilter<IObjetoCompra>({ params: ['objeto'], getList: getListObjetosCompras, accessToken: token }),
      attrVal: "nome"
    }},
  }
  
  function isFieldSelect(obj: FieldFormTypes | undefined): obj is FieldFormSelect {
    return !!obj && obj.type === 'select';
  }
  function isFieldAutocompleteStatic(obj: FieldFormTypes | undefined): obj is FieldFormAutocompleteStatic {
    return !!obj && obj.type === 'autocompletStatic';
  }
  function isFieldAutocompleteAsync(obj: FieldFormTypes | undefined): obj is FieldFormAutocompleteAsync {
    return !!obj && obj.type === 'autocompleteAsync';
  }

  const clearForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    reset();
    Object.keys(fields).forEach(k => {
      const key = k as keyof FormDataCotacao;
      const v = fields[key];
      if (v != undefined && isFieldAutocompleteAsync(v)) {
        v.auto.async.setFilterText('');
      }
    })
    dispatch(doSearch(getValues()));
  }

  //inicializar a lista de municipios ao alterar a unidade federativa
  useEffect(() => {
    if (!!token) {
      setLastUF(ufId);
      const fieldMunicipio = fields.municipioId;
      if (ufId != lastUF && fieldMunicipio != undefined && isFieldAutocompleteAsync(fieldMunicipio)) {
        if (ufId != null) {
          fieldMunicipio.auto.async.reload();
        }
        fieldMunicipio.auto.async.setFilterText('')
        resetField('municipioId')
      }
    }
  }, [token, ufId, lastUF, fields.municipioId, resetField])

  useEffect(() => {
    const changeVal = async (attr: keyof FormDataCotacao, val: string) => {
      const f = fields[attr];
      if (isFieldAutocompleteAsync(f)) {
        let desc = null;
        if (f.auto.apiFindDesc) {
          desc = await f.auto.apiFindDesc(val);
        } else if (f.auto.attrVal == 'nome') {
          desc = val;
        }
        if (desc != null) {
          f.auto.async.setFilterText(desc);
          f.auto.async.setSelectedKeys(new Set(val));
          setValue(attr, val, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
        }
      } else {
        setValue(attr, val, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
      }
    }
    
    if (isClientNextjs()) {
      //se possuir parametros get, ignora a última busca armazenada em localstorage
      for (const [key, value] of Object.entries(getValues())) {
        const k = key as keyof FormDataCotacao;
        if (searchParams != null && Array.from(searchParams.keys()).length > 0) {
          const newVal = searchParams.get(key);
          if (newVal != null && newVal != value) {
            changeVal(k, newVal+'');
          }
        } else if (initialFormData.hasOwnProperty(key)) {
          const newVal = _initialFormDataLocalStorage[k];
          if (newVal != value && !!newVal) {
            changeVal(k, newVal+'');
          }
        }
      }     
    }
  }, [_initialFormDataLocalStorage, searchParams, getValues, setValue]);

  const mountFieldForm = (name: keyof FormDataCotacao, attr: FieldFormTypes | undefined) => {
    if (isFieldSelect(attr)) {
      return (
        <SelectForm<FormDataCotacao> name={name} label={attr.label} control={control} items={attr.items} errors={errors} />
      )
    } else if (isFieldAutocompleteStatic(attr)) {
      return (
        <AutocompleteForm<FormDataCotacao> name={name} label={attr.label} control={control} items={attr.items} errors={errors} />
      )
    } else if (isFieldAutocompleteAsync(attr)) {
      return (
        <AutocompleteAsyncForm<IObjetoAPI, FormDataCotacao> name={name} label={attr.label} attrVal={attr.auto.attrVal} control={control} isDisabled={attr.auto.isDisabled} errors={errors} autocompleteHook={attr.auto.async}/>
      )
    }
  }

  const classname_rowmobile = "flex-col md:flex-row";

  if (status == "loading") {
    return (
      <>Carregando informações do formulário de cotação...</>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className='container flex flex-col items-start justify-start'>
        <FormRow className={classname_rowmobile}>
          <div className="basis-1/4">
            { mountFieldForm("ano", fields.ano) }
          </div> 
          <div className="basis-1/4">
            { mountFieldForm("porteFornecedor", fields.porteFornecedor) }
          </div>
          <div className="basis-1/4">
            { mountFieldForm("esferaId", fields.esferaId) }
          </div>
          <div className="basis-1/4">
            { mountFieldForm("formaCompraId", fields.formaCompraId) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/3">
            { mountFieldForm("modalidadeCompraId", fields.modalidadeCompraId) }
          </div>
          <div className="basis-1/3">
            { mountFieldForm("periodoCompraId", fields.periodoCompraId) }
          </div>
          <div className="basis-1/3">
            { mountFieldForm("situacao_licitacao", fields.situacao_licitacao) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            { mountFieldForm("ufId", fields.ufId) }
          </div>

          <div className="basis-1/2">
            { mountFieldForm("municipioId", fields.municipioId) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            { mountFieldForm("orgaoSuperiorId", fields.orgaoSuperiorId) }
          </div>

          <div className="basis-1/2">
            { mountFieldForm("orgaoId", fields.orgaoId) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            { mountFieldForm("fornecedorId", fields.fornecedorId) }
          </div>

          <div className="basis-1/2">
            { mountFieldForm("materialId", fields.materialId) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            { mountFieldForm("ugId", fields.ugId) }
          </div>
          <div className="basis-1/2">
            { mountFieldForm("unidade_fornecimento", fields.unidade_fornecimento) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            { mountFieldForm("descricao", fields.descricao) }
          </div>
          <div className="basis-1/2">
            { mountFieldForm("descricaoComplementar", fields.descricaoComplementar) }
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-full">
            { mountFieldForm("objeto", fields.objeto) }
          </div>
        </FormRow>
        
        <FormRow className="justify-end">
        
          <Button color="default" onClick={(e) => clearForm(e)}>
            Limpar
          </Button>
          <Button color="primary" type="submit">
            Pesquisar
          </Button>
        </FormRow>
      </form>
  )
}

export default SearchItensLicitacaoForm;