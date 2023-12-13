'use client'

import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import yupStrings from '@/utils/yupStrings';
import { Divider, Button } from '@nextui-org/react'
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"

import { IFornecedor, IItemDescricao, IItemSelect, IMunicipio, INomeMaterial, IObjetoAPI, IObjetoCompra, IOrgao, IUnidadeGestora } from "@/interfaces/types";
import { getListFornecedores, getListMunicipios, getListNomeMaterial, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento, getListObjetosCompras, getListDescricao } from "@/hooks/api";
import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";

import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";
import AutocompleteForm from '@/components/molecules/AutocompleteForm';
import AutocompleteAsyncForm from '@/components/molecules/AutocompleteAsyncForm';
import SelectForm from '@/components/molecules/SelectForm';

interface IProps {
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
  ano_compra: yup.string().required(yupStrings.required),
  porte_empresa: yup.string(),
  esfera: yup.string(),
  compra_forma: yup.string(),
  compra_modalidade: yup.string(),
  compra_periodo: yup.string(),
  situacao_licitacao: yup.string(),

  unidade_federativa: yup.string().nullable(),
  municipio: yup.string().nullable(),
  orgao_superior: yup.string().nullable(),
  orgao: yup.string().nullable(),
  fornecedor: yup.string().nullable(),
  material: yup.string().nullable(),
  unidade_gestora: yup.string().nullable(),
  unidade_fornecimento: yup.string().nullable(),
  objeto_compra: yup.string().nullable(),
  descricao: yup.string().nullable(),
  descricao_complementar: yup.string().nullable(),
});
type FormData = yup.InferType<typeof schema>;

const initialForm: FormData = {
  ano_compra: '',
  compra_forma: '',
  compra_modalidade: '',
  compra_periodo: '',
  esfera: '',
  fornecedor: '',
  material: '',
  municipio: '',
  orgao: '',
  orgao_superior: '',
  porte_empresa: '',
  situacao_licitacao: '',
  unidade_federativa: '',
  unidade_fornecimento: '',
  unidade_gestora: '',
  objeto_compra: '',
  descricao: '',
  descricao_complementar: '',
}

const PageClient: React.FC<IProps> = ({
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

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)
  const onSubmitError: SubmitErrorHandler<FormData> = (data) => console.log(data)

  const unidade_federativa = watch("unidade_federativa");

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
    infos: unidade_federativa ? [{ val: unidade_federativa, param: 'uuiduf' }] : []
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
    console.log('clearForm')
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
    setLastUF(unidade_federativa);
    if (unidade_federativa != lastUF) {
      if (unidade_federativa != null) {
        autoCompleteMunicipio.reload()
      }
      autoCompleteMunicipio.setFilterText('')
      resetField('municipio')
    }
  }, [unidade_federativa, autoCompleteMunicipio, lastUF, resetField])

  const hasUF = useCallback(() => {
    return unidade_federativa != undefined && unidade_federativa != '';
  }, [unidade_federativa]);


  return (
    <section className='py-4 flex items-center justify-center flex-col'>
      
      <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className='container flex flex-col items-start justify-start'>

        <FormTitle className='text-lg font-bold uppercase text-primary'>Cotação Rápida</FormTitle>
        
        <Divider className="my-4" />

        <FormRow>
          <div className="basis-1/4">
            {/* <Input type="email" label="Email" /> */}
            <SelectForm<FormData>
              name="ano_compra"
              label="Ano da Compra"
              control={control}
              items={anosCompras}
              errors={errors}
              />
          </div> 
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="porte_empresa"
              label="Porte da Empresa"
              items={empresaPorte}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="esfera"
              label="Esfera"
              items={esferas}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/4">
            <SelectForm<FormData>
              name="compra_forma"
              label="Forma da Compra"
              items={compraFormas}
              control={control}
              errors={errors}
              />
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/3">
            <SelectForm<FormData>
              name="compra_modalidade"
              label="Modalidade Compra"
              items={compraModalidades}
              control={control}
              errors={errors}
              />
          </div>
          <div className="basis-1/3">
            <SelectForm<FormData>
              name="compra_periodo"
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

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteForm<FormData>
              name="unidade_federativa"
              label="Unidade Federativa"
              control={control}
              items={unidadesFederativas}
              errors={errors}
              />
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormData>
              name="municipio"
              label="Município"
              attrVal="uuid"
              control={control}
              isDisabled={!hasUF()}
              errors={errors}
              autocompleteHook={autoCompleteMunicipio}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IOrgao, FormData>
              name="orgao_superior"
              label="Orgão Superior"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteOrgaosSuperiores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IOrgao, FormData>
              name="orgao"
              label="Orgão"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteOrgaos}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IFornecedor, FormData>
              name="fornecedor"
              label="Fornecedor"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteFornecedores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormData>
              name="material"
              label="Nome/Código Material"
              attrVal="uuid"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteNomeMaterial}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAsyncForm<IUnidadeGestora, FormData>
              name="unidade_gestora"
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

        <FormRow>
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
              name="descricao_complementar"
              label="Descrição Complementar"
              attrVal="nome"
              control={control}
              errors={errors}
              autocompleteHook={autoCompleteDescricaoComplementar}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-full">
            <AutocompleteAsyncForm<IObjetoCompra, FormData>
              name="objeto_compra"
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
      
    </section>
  )
}

export default PageClient;