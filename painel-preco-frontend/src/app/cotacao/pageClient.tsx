'use client'

import {Button, Select, SelectItem} from "@nextui-org/react";

import { Autocomplete, AutocompleteItem, Divider, Input } from '@nextui-org/react'
import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";
import { IFornecedor, IItemSelect, IOrgao, IUnidadeFederativa, IUnidadeGestora } from "@/interfaces/types";
import { getListEstados, getListFornecedores, getListOrgaos, getListUASG } from "@/hooks/api";
import { useAutocompleteFilter } from "@/hooks/autocomplete/useAutocompleteFilter";

interface IProps {
  empresaPorte: IItemSelect[]
  esferas: IItemSelect[]
  compraFormas: IItemSelect[]
  compraModalidades: IItemSelect[]
  compraPeriodos: IItemSelect[]
  situacoesLicitacoes: IItemSelect[]

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
    searchParams: ['nome', 'documento'],
    getList: getListFornecedores
  });

  const autoCompleteOrgaos = useAutocompleteFilter<IOrgao>({
    getList: getListOrgaos
  });

  const autoCompleteUASG = useAutocompleteFilter<IUnidadeGestora>({
    getList: getListUASG
  });

  const autoCompleteUnidadesFederativas = useAutocompleteFilter<IUnidadeFederativa>({
    getList: getListEstados
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
              className="w-full"
              variant="flat"
              label="Fornecedor"
              inputValue={autoCompleteFornecedores.filterText}
              isLoading={autoCompleteFornecedores.isLoading}
              items={autoCompleteFornecedores.items}
              placeholder="Digite para buscar..."
              onInputChange={autoCompleteFornecedores.setFilterText}
            >
              {(item) => (
                <AutocompleteItem key={item.uuid} className="capitalize">
                  {item.nome}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className="basis-1/2">
            <Autocomplete
              className="w-full"
              variant="flat"
              label="Orgão"
              inputValue={autoCompleteOrgaos.filterText}
              isLoading={autoCompleteOrgaos.isLoading}
              items={autoCompleteOrgaos.items}
              placeholder="Digite para buscar..."
              onInputChange={autoCompleteOrgaos.setFilterText}
            >
              {(item) => (
                <AutocompleteItem key={item.uuid} className="capitalize">
                  {item.nome}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <Autocomplete
              className="w-full"
              variant="flat"
              label="Unidade Gestora"
              inputValue={autoCompleteUASG.filterText}
              isLoading={autoCompleteUASG.isLoading}
              items={autoCompleteUASG.items}
              placeholder="Digite para buscar..."
              onInputChange={autoCompleteUASG.setFilterText}
            >
              {(item) => (
                <AutocompleteItem key={item.uuid} className="capitalize">
                  {item.nome}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className="basis-1/2">
            <Autocomplete
              className="w-full"
              variant="flat"
              label="Unidade Federativa"
              inputValue={autoCompleteUnidadesFederativas.filterText}
              isLoading={autoCompleteUnidadesFederativas.isLoading}
              items={autoCompleteUnidadesFederativas.items}
              placeholder="Digite para buscar..."
              onInputChange={autoCompleteUnidadesFederativas.setFilterText}
            >
              {(item) => (
                <AutocompleteItem key={item.uuid} className="capitalize">
                  {item.nome}
                </AutocompleteItem>
              )}
            </Autocomplete>
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