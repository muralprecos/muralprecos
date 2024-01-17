'use client'

import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import yupStrings from '@/utils/yupStrings';
import { Button } from '@nextui-org/react'
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"

import { IFornecedor, IItemDescricao, IItemSelect, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IUnidadeGestora } from "@/interfaces/types";
import { getListFornecedores, getListMunicipios, getListNomeMaterial, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento, getListObjetosCompras, getListDescricao, FIELDS_COTACOES_LIST } from "@/hooks/api";
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
  const dispatch = useDispatch();
  const _initialFormData: FormDataCotacao = useAppSelector((state) => state.cotacaoSearchReducer.value);

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

  useEffect(() => {
    if (isClientNextjs()) {
      //se possuir parametros get, ignora a última busca armazenada em localstorage
      if (searchParams != null && Array.from(searchParams.keys()).length > 0) {
        for (const [key, value] of Object.entries(getValues())) {
          const newVal = searchParams.get(key);
          if (newVal != null) {
            const k = key as keyof FormDataCotacao;
            if (newVal != value) {
              setValue(k, newVal+'', { shouldValidate: true, shouldTouch: true, shouldDirty: true });
            }
          }
        }
      } else {
        //TODO: caso seja autocomplete simular pesquisa
        //Sugestão: criar um map de nome, useAutocompleteFilter
        for (const [key, value] of Object.entries(getValues())) {
          if (initialFormData.hasOwnProperty(key)) {
            const k = key as keyof FormDataCotacao;
            const newVal = _initialFormData[k];
            if (newVal != value) {
              setValue(k, newVal, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
            }
          }
        }
      }
      
    }
  }, [_initialFormData, searchParams, getValues, setValue]);


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
    //console.log(data)
  }

  const ufId = watch("ufId");

  const autoCompleteFornecedores = useAutocompleteFilter<IFornecedor>({
    searchParams: ['nome'],
    getList: getListFornecedores
  });

  const autoCompleteOrgaos = useAutocompleteFilter<IOrgao>({
    getList: getListOrgaos
  });

  const autoCompleteOrgaosSuperiores = useAutocompleteFilter<IOrgao>({
    getList: getListOrgaosSuperiores
  });

  const autoCompleteUASG = useAutocompleteFilter<IUnidadeGestora>({
    getList: getListUASG
  });

  const autoCompleteUnidadesFornecimento = useAutocompleteFilter<IObjetoAPI>({
    getList: getListUnidadesFornecimento
  });

  const autoCompleteNomeMaterial = useAutocompleteFilter<INomeMaterial>({
    getList: getListNomeMaterial
  });

  const autoCompleteMunicipio = useAutocompleteFilter<IMunicipio>({
    minCharactersLoad: 0,
    getList: getListMunicipios,
    infos: ufId ? [{ val: ufId, param: 'uuiduf' }] : []
  });

  const autoCompleteObjetoCompra = useAutocompleteFilter<IObjetoCompra>({
    searchParams: ['objeto'],
    getList: getListObjetosCompras
  });

  const autoCompleteDescricao = useAutocompleteFilter<IItemDescricao>({
    searchParams: ['descricao'],
    getList: getListDescricao
  });

  const autoCompleteDescricaoComplementar = useAutocompleteFilter<IItemDescricao>({
    searchParams: ['descricaoComplementar'],
    getList: getListDescricao
  });


  const clearForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    reset();
    autoCompleteFornecedores.setFilterText('')
    autoCompleteOrgaos.setFilterText('')
    autoCompleteOrgaosSuperiores.setFilterText('')
    autoCompleteUASG.setFilterText('')
    autoCompleteUnidadesFornecimento.setFilterText('')
    autoCompleteNomeMaterial.setFilterText('')
    autoCompleteMunicipio.setFilterText('')
    autoCompleteObjetoCompra.setFilterText('')
    autoCompleteDescricao.setFilterText('')
    autoCompleteDescricaoComplementar.setFilterText('')
    dispatch(doSearch(getValues()));
  }

  const [lastUF, setLastUF] = useState<string|null>();
  //inicializar a lista de municipios ao alterar a unidade federativa
  useEffect(() => {
    setLastUF(ufId);
    if (ufId != lastUF) {
      if (ufId != null) {
        autoCompleteMunicipio.reload()
      }
      autoCompleteMunicipio.setFilterText('')
      resetField('municipioId')
    }
  }, [ufId, autoCompleteMunicipio, lastUF, resetField])

  const hasUF = useCallback(() => {
    return ufId != undefined && ufId != '';
  }, [ufId]);

  const classname_rowmobile = "flex-col md:flex-row";


  return (
    <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className='container flex flex-col items-start justify-start'>
        <FormRow className={classname_rowmobile}>
          <div className="basis-1/4">
            <SelectForm<FormDataCotacao>
              name="ano"
              label="Ano da Compra"
              control={control}
              items={anosCompras}
              errors={errors}
              />
          </div> 
          <div className="basis-1/4">
            <SelectForm<FormDataCotacao>
              name="porteFornecedor"
              label="Porte da Empresa"
              items={empresaPorte}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormDataCotacao>
              name="esferaId"
              label="Esfera"
              items={esferas}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormDataCotacao>
              name="formaCompraId"
              label="Forma da Compra"
              items={compraFormas}
              control={control}
              errors={errors}
              />
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/3">
            <SelectForm<FormDataCotacao>
              name="modalidadeCompraId"
              label="Modalidade Compra"
              items={compraModalidades}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/3">
            <SelectForm<FormDataCotacao>
              name="periodoCompraId"
              label="Período da Compra"
              items={compraPeriodos}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/3">
            <AutocompleteForm<FormDataCotacao>
              name="situacao_licitacao"
              label="Situação da Licitação"
              control={control}
              items={situacoesLicitacoes}
              errors={errors}
              />
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            <AutocompleteForm<FormDataCotacao>
              name="ufId"
              label="Unidade Federativa"
              control={control}
              items={unidadesFederativas}
              errors={errors}
              />
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IMunicipio, FormDataCotacao>
              name="municipioId"
              label="Município"
              attrVal="uuid"
              control={control}
              isDisabled={!hasUF()}
              errors={errors}
              autocompleteHook={autoCompleteMunicipio}/>
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IOrgao, FormDataCotacao>
              name="orgaoSuperiorId"
              label="Orgão Superior"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteOrgaosSuperiores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IOrgao, FormDataCotacao>
              name="orgaoId"
              label="Orgão"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteOrgaos}/>
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IFornecedor, FormDataCotacao>
              name="fornecedorId"
              label="Fornecedor"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteFornecedores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormDataCotacao>
              name="materialId"
              label="Nome/Código Material"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteNomeMaterial}/>
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormDataCotacao>
              name="ugId"
              label="Unidade Gestora"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteUASG}/>
          </div>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IObjetoAPI, FormDataCotacao>
              name="unidade_fornecimento"
              label="Unidade de Fornecimento"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteUnidadesFornecimento}/>
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IObjetoCompra, FormDataCotacao>
              name="descricao"
              label="Descrição"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteDescricao}/>
          </div>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IObjetoCompra, FormDataCotacao>
              name="descricaoComplementar"
              label="Descrição Complementar"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteDescricaoComplementar}/>
          </div>
        </FormRow>

        <FormRow className={classname_rowmobile}>
          <div className="basis-full">
            <AutocompleteAsyncForm<IObjetoCompra, FormDataCotacao>
              name="objeto"
              label="Objeto da Compra"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteObjetoCompra}/>
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