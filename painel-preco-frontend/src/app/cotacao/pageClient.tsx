'use client'

import {Button, Select, SelectItem} from "@nextui-org/react";

import { Autocomplete, AutocompleteItem, Divider, Input } from '@nextui-org/react'
import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";
import { IFornecedor, IItemSelect, INomeMaterial, IObjetoAPI, IOrgao, IUnidadeFederativa, IUnidadeGestora } from "@/interfaces/types";
import { getListEstados, getListFornecedores, getListNomeMaterial, getListOrgaos, getListOrgaosSuperiores, getListUASG, getListUnidadesFornecimento } from "@/hooks/api";
import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";
import AutocompleteAPI from "@/components/molecules/AutocompleteAPI";

interface IProps {
  empresaPorte: IItemSelect[]
  esferas: IItemSelect[]
  compraFormas: IItemSelect[]
  compraModalidades: IItemSelect[]
  compraPeriodos: IItemSelect[]
  situacoesLicitacoes: IItemSelect[]
  unidadesFederativas: IItemSelect[]

  compraAno?: IItemSelect[]
  materialNome?: IItemSelect[]
  materialCodigo?: IItemSelect[]
  itemDescricao?: IItemSelect[]
  itemDescricaoComplementar?: IItemSelect[]
  compraObjeto?: IItemSelect[]
  unidadeFornecimento?: IItemSelect[]
  orgaoSuperior?: IItemSelect[]
  orgao?: IItemSelect[]
  uasg?: IItemSelect[]
}

const PageClient: React.FC<IProps> = ({
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  ...opts
}) => {

  const clearForm = () => {
  }

  const anos = [
    {label: "2013", value: "2013"},
    {label: "2014", value: "2014"},
    {label: "2015", value: "2015"},
    {label: "2016", value: "2016"},
    {label: "2017", value: "2017"},
    {label: "2018", value: "2018"},
    {label: "2019", value: "2019"},
    {label: "2020", value: "2020"},
    {label: "2021", value: "2021"},
    {label: "2022", value: "2022"},
    {label: "2022", value: "2023"}
  ]

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

  return (
    <section className='py-4 flex items-center justify-center flex-col'>
      <div className='container flex flex-col items-start justify-start'>

        <FormTitle className='text-lg font-bold uppercase text-primary'>Cotação Rápida</FormTitle>
        
        <Divider className="my-4" />

        <FormRow>
          <div className="basis-1/4">
            {/* <Input type="email" label="Email" /> */}
            <Select label="Ano da Compra" className="w-full" items={anos}>
              {anos.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div> 
          <div className="basis-1/4">
            <Select label="Porte da Empresa" className="w-full">
              {empresaPorte.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/4">
            <Select label="Esfera" className="w-full">
              {esferas.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/4">
            <Select label="Forma da Compra" className="w-full">
              {compraFormas.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/3">
            <Select label="Modalidade Compra" className="w-full">
              {compraModalidades.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/3">
            <Select label="Período da Compra" className="w-full">
              {compraPeriodos.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/3">
            <Autocomplete
              label="Situação da Licitação"
              className="w-full"
            >
              {situacoesLicitacoes.map((o) => (
                <AutocompleteItem key={o.value} value={o.value}>
                  {o.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <Autocomplete
              label="Unidade Federativa"
              className="w-full"
            >
              {unidadesFederativas.map((o) => (
                <AutocompleteItem key={o.value} value={o.value}>
                  {o.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="basis-1/2">
            {/*  TODO : CRIAR PARA MUNICIPIO LIGADO AO ESTADO */}
            <AutocompleteAPI<IUnidadeGestora>
              label="Município"
              autocompleteHook={autoCompleteUASG}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAPI<IOrgao>
              label="Orgão Superior"
              autocompleteHook={autoCompleteOrgaosSuperiores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAPI<IOrgao>
              label="Orgão"
              autocompleteHook={autoCompleteOrgaos}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAPI<IFornecedor>
              label="Fornecedor"
              autocompleteHook={autoCompleteFornecedores}/>
          </div>

          <div className="basis-1/2">
            <AutocompleteAPI<IUnidadeGestora>
              label="Nome/Código Material"
              autocompleteHook={autoCompleteNomeMaterial}/>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteAPI<IUnidadeGestora>
              label="Unidade Gestora"
              autocompleteHook={autoCompleteUASG}/>
          </div>
          <div className="basis-1/2">
            <AutocompleteAPI<IObjetoAPI>
              label="Unidade de Fornecimento"
              autocompleteHook={autoCompleteUnidadesFornecimento}/>
          </div>
        </FormRow>

        

        <FormRow className="justify-end">
          <Button color="default" endContent={'\/'} onClick={() => clearForm()}>
            Limpar
          </Button>
          <Button color="primary" endContent={'\/'}>
            Pesquisar
          </Button>
        </FormRow>

      </div>
    </section>
  )
}

export default PageClient;