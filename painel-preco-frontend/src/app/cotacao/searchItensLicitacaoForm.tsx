'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import yupStrings from '@/utils/yupStrings';
import { Divider, Button } from '@nextui-org/react'
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"

import { IFornecedor, IItemDescricao, IItemSelect, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IRetornoPesquisaItensLicitacao, IReturnRequestAPIBasic, IUnidadeGestora } from "@/interfaces/types";
import { getListFornecedores, getListMunicipios, getListNomeMaterial, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento, getListObjetosCompras, getListDescricao, getPesquisarCotacoes } from "@/hooks/api";
import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";

import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";
import AutocompleteForm from '@/components/molecules/AutocompleteForm';
import AutocompleteAsyncForm from '@/components/molecules/AutocompleteAsyncForm';
import SelectForm from '@/components/molecules/SelectForm';
import { objToParamSearch } from '@/utils/searchParamUtils';
import { TABS_COTACAO } from './pageClient';

export interface IPropsSearchItensLicitacaoForm {
  anosCompras: IItemSelect[]
  empresaPorte: IItemSelect[]
  esferas: IItemSelect[]
  compraFormas: IItemSelect[]
  compraModalidades: IItemSelect[]
  compraPeriodos: IItemSelect[]
  situacoesLicitacoes: IItemSelect[]
  unidadesFederativas: IItemSelect[]
  setItens?: Dispatch<SetStateAction<IRetornoPesquisaItensLicitacao[]>>
  setIsLoadingItens?: Dispatch<SetStateAction<boolean>>
  setTabSelected?: Dispatch<SetStateAction<string>>
}

const schema = yup.object({
  ano: yup.string().required(yupStrings.required),
  porteFornecedor: yup.string(),
  esferaId: yup.string(),
  formaCompraId: yup.string(),
  modalidadeCompraId: yup.string(),
  periodoCompraId: yup.string(),

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
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  ano: '',
  formaCompraId: '',
  modalidadeCompraId: '',
  periodoCompraId: '',
  esferaId: '',
  fornecedorId: '',
  materialId: '',
  municipioId: '',
  orgaoId: '',
  orgaoSuperiorId: '',
  porteFornecedor: '',
  situacao_licitacao: '',
  ufId: '',
  unidade_fornecimento: '',
  ugId: '',
  objeto: '',
  descricao: '',
  descricaoComplementar: '',
}

const SearchItensLicitacaoForm: React.FC<IPropsSearchItensLicitacaoForm> = ({
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  setItens,
  setIsLoadingItens,
  setTabSelected,
  ...opts
}) => {

  const {
    control,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialForm
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!!setItens) {
      setItens([])
    }
    if (!!setTabSelected) {
      setTabSelected(TABS_COTACAO.LIST.key);
    }
    setIsLoadingItens ? setIsLoadingItens(true) : null;
    const info = objToParamSearch(data);
    const req: IReturnRequestAPIBasic<IRetornoPesquisaItensLicitacao>|null = await getPesquisarCotacoes({ page: 0, size: 20, info });
    if (!!setItens) {
      setIsLoadingItens ? setIsLoadingItens(false) : null;
      if (req != null) {
        setItens(req.content)
      }
    }
  }
  const onSubmitError: SubmitErrorHandler<FormData> = (data) => console.log(data)

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


  const clearForm = () => {
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
        <FormTitle className='text-lg font-bold uppercase text-primary'>Cotação Rápida</FormTitle>
        <Divider className="my-4" />
        <FormRow className={classname_rowmobile}>
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="ano"
              label="Ano da Compra"
              control={control}
              items={anosCompras}
              errors={errors}
              />
          </div> 
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="porteFornecedor"
              label="Porte da Empresa"
              items={empresaPorte}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="esferaId"
              label="Esfera"
              items={esferas}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormData>
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
            <SelectForm<FormData>
              name="modalidadeCompraId"
              label="Modalidade Compra"
              items={compraModalidades}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/3">
            <SelectForm<FormData>
              name="periodoCompraId"
              label="Período da Compra"
              items={compraPeriodos}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/3">
            <AutocompleteForm<FormData>
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
            <AutocompleteForm<FormData>
              name="ufId"
              label="Unidade Federativa"
              control={control}
              items={unidadesFederativas}
              errors={errors}
              />
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IMunicipio, FormData>
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
            <AutocompleteAsyncForm<IOrgao, FormData>
              name="orgaoSuperiorId"
              label="Orgão Superior"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteOrgaosSuperiores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IOrgao, FormData>
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
            <AutocompleteAsyncForm<IFornecedor, FormData>
              name="fornecedorId"
              label="Fornecedor"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteFornecedores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormData>
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
            <AutocompleteAsyncForm<IUnidadeGestora, FormData>
              name="ugId"
              label="Unidade Gestora"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteUASG}/>
          </div>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IObjetoAPI, FormData>
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
            <AutocompleteAsyncForm<IObjetoCompra, FormData>
              name="descricao"
              label="Descrição"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteDescricao}/>
          </div>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IObjetoCompra, FormData>
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
            <AutocompleteAsyncForm<IObjetoCompra, FormData>
              name="objeto"
              label="Objeto da Compra"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteObjetoCompra}/>
          </div>
        </FormRow>
        
        <FormRow className="justify-end">
          <Button color="default" onClick={() => clearForm()}>
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