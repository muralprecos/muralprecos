"use client"

import {Button, Checkbox, Select, SelectItem} from "@nextui-org/react";

import { Divider, Input } from '@nextui-org/react'
import FormTitle from '@/components/atoms/FormTitle'
import FormRow from "@/components/atoms/FormRow";

const animals = [
  {label: "Últimos 360 dias", value: "1"},
  {label: "Últimos 180 dias", value: "2"},
  {label: "Últimos 90 dias", value: "3"},
  {label: "Últimos 30 dias", value: "4"}
]

export default function Home() {
  return (
    <section className='py-4 flex items-center justify-center flex-col'>
      <div className='container flex flex-col items-start justify-start'>

        <FormTitle className='text-lg font-bold uppercase text-primary'>Cotação Rápida</FormTitle>
        
        <Divider className="my-4" />

        <FormRow>
          <div className="basis-1/2">
            <Input type="text" label="Nome do Item" />
          </div>
          <div className="basis-1/4">
            <Select label="Período" className="w-full">
              {animals.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                  {animal.label}
                </SelectItem>
              ))}
            </Select>
          </div> 
          <div className="basis-1/4 flex items-center">
            <Button color="default" className="w-full" size="lg">
              CATMAT/CATSER
            </Button>
          </div>
        
        </FormRow>

        <FormRow className="justify-between">
          <Checkbox>Pesquisar apenas o termo digitado</Checkbox>
          <Button variant="bordered" color="primary" endContent={'\/'}>
            Mais Filtros
          </Button>
        </FormRow>

        <FormRow>
          <div className="basis-1/2">
            <Input type="text" label="Marca/Fabricante" />
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
              {animals.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                  {animal.label}
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
              {animals.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                  {animal.label}
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
              {animals.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                  {animal.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </FormRow>

        <FormRow className="justify-end">
          <Button color="default" endContent={'\/'}>
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