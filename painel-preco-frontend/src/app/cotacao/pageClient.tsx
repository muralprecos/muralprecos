'use client'

import {Button, Select, SelectItem} from "@nextui-org/react";

import { Divider, Input } from '@nextui-org/react'
import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";
import AutocompleteField, { AutocompleteFieldHandle } from "@/components/molecules/AutocompleteField";
import { IItemAutocomplete, } from "@/interfaces/types";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import { getListEstados, getListFornecedores, getListOrgaos, getListUASG } from "@/hooks/api";
import AutocompleteFieldAsync from "@/components/organisms/AutocompleteFieldAsync";


interface IProps {
  empresaPorte: IItemAutocomplete[]
  esferas: IItemAutocomplete[]
  compraFormas: IItemAutocomplete[]
  compraModalidades: IItemAutocomplete[]
  compraPeriodos: IItemAutocomplete[]
  situacoesLicitacoes: IItemAutocomplete[]

  compraAno?: IItemAutocomplete[]
  materialNome?: IItemAutocomplete[]
  materialCodigo?: IItemAutocomplete[]
  itemDescricao?: IItemAutocomplete[]
  itemDescricaoComplementar?: IItemAutocomplete[]
  compraObjeto?: IItemAutocomplete[]
  unidadeFornecimento?: IItemAutocomplete[]
  orgaoSuperior?: IItemAutocomplete[]
  orgao?: IItemAutocomplete[]
  uasg?: IItemAutocomplete[]
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

  const refAutocompFornecedores = useRef<AutocompleteFieldHandle>(null);
  const [optionsFornecedores, setOptionsFornecedores] = useState<IItemAutocomplete[]>([]);
  const [valueFornecedor, setValueFornecedor] = useState<IItemAutocomplete | null>(null);

  const clearForm = () => {
    setValueFornecedor(null)
    setOptionsFornecedores([]);
    refAutocompFornecedores.current?.setValueInput(null)
  }

  const getValAutocomplete = (f: IItemAutocomplete | null ) => {
    return f?.description || ''
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col'>
      <div className='container flex flex-col items-start justify-start'>

        <FormTitle className='text-lg font-bold uppercase text-primary'>Cotação Rápida</FormTitle>
        
        <Divider className="my-4" />

        <FormRow>
          <div className="basis-1/4">
            <Input type="email" label="Email" />
            {/* <Select label="Ano da Compra" className="w-full">
              {compraAno.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select> */}
          </div> 
          <div className="basis-1/4">
            <Select label="Porte da Empresa" className="w-full">
              {empresaPorte.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/4">
            <Select label="Esfera" className="w-full">
              {esferas.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/4">
            <Select label="Forma da Compra" className="w-full">
              {compraFormas.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/3">
            <Select label="Modalidade Compra" className="w-full">
              {compraModalidades.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/3">
            <Select label="Período da Compra" className="w-full">
              {compraPeriodos.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/3">
            <Select label="Situação da Licitação" className="w-full">
              {situacoesLicitacoes.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteFieldAsync 
              id="CNPJ/CPF/NOME do Fornecedor"
              autocompleteService={getListFornecedores}
              autocompleteMinLength={5}
              />
          </div>
          <div className="basis-1/4">
            <Input type="email" value={getValAutocomplete(valueFornecedor)} label="Teste Valor Fornecedor" />
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteFieldAsync
              id="Orgão"
              autocompleteService={getListOrgaos}
              />
          </div>
          <div className="basis-1/4">
            <Input type="email" value={getValAutocomplete(valueFornecedor)} label="Teste Valor Orgao" />
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteFieldAsync 
              id="UASG"
              autocompleteService={getListUASG}
              />
          </div>
          <div className="basis-1/4">
            <Input type="email" value={getValAutocomplete(valueFornecedor)} label="Teste Valor UASG" />
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteFieldAsync 
              id="Unidade Federativa"
              autocompleteService={getListEstados}
              />
          </div>
          <div className="basis-1/4">
            <Input type="email" value={getValAutocomplete(valueFornecedor)} label="Teste Valor Unidade Federativa" />
          </div>
        </FormRow>



{/* 


          <div className="basis-1/4 flex items-center">
            <AutocompleteField 
              type="text" label="Código do Material"
              suggestions={materialCodigo}
              onSuggestionSelected={(e) => { console.log(e) }}
              />
          </div>

        <FormRow className="justify-between">
          <Checkbox>Pesquisar apenas o termo digitado</Checkbox>
          <Button variant="bordered" color="primary" endContent={'\/'}>
            Mais Filtros
          </Button>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <AutocompleteField 
              type="text" label="Fornecedor"
              suggestions={[{key: 1, description: 'teste'},{key: 2, description: 'testa'},{key: 3, description: 'tess'},{key: 4, description: 'test'},{key: 5, description: 'teasd'}]}
              onSuggestionSelected={(e) => { console.log(e) }}
              />
          </div>
          <div className="basis-1/2">
            <Input type="text" label="Modelo" />
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <Input type="text" label="Qtd Fornecedores" />
          </div>
          <div className="basis-1/2">
            <Input type="text" label="CNPJ Fornecedor" />
          </div>
          <div className="basis-1/2">
            <Select label="Porte do Vendedor" className="w-full">
              {fornecedores.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/2 flex items-center">
            <Checkbox isDisabled>Apenas Propostas Vencedoras</Checkbox>
          </div>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <Select label="Modalidade" className="w-full">
              {fornecedores.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="basis-1/2">
            <Input type="text" label="Referência Licitação" />
          </div>
          <div className="basis-1/2">
            <Input type="text" label="UASG / Instituição / CNPJ" />
          </div>
          <div className="basis-1/2 flex items-center">
            <Select label="Âmbito" className="w-full">
              {fornecedores.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.description}
                </SelectItem>
              ))}
            </Select>
          </div>
        </FormRow>

      */}
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