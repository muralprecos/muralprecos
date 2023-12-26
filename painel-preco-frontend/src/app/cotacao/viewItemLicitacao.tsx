// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, Listbox, ListboxItem, ListboxSection, ScrollShadow, Selection, Skeleton, Spacer } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Dispatch, Key, SetStateAction, useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { TABS_COTACAO } from "./pageClient";
import InfoText from "@/components/atoms/InfoText";
import InfoTitle from "@/components/atoms/InfoTitle";

export interface IPropsViewItensLicitacao {
  isLoading: boolean
  itemLicitacao: IItemLicitacao|null
  setTabSelected: Dispatch<SetStateAction<string>>
}

const INFO_TYPE = {
  TODOS: "all",
  ITEM: "item",
  LICITACAO: "licitacao"
}

const ViewItemLicitacao: React.FC<IPropsViewItensLicitacao> = ({
  isLoading = false,
  itemLicitacao,
  setTabSelected,
  ...opts
}) => {
  const { theme, setTheme } = useTheme()

  const showTitle = () => {
    return itemLicitacao != null ? itemLicitacao.descricao : isLoading ? 'Carregando Item...' : 'Item não encontrado';
  }

  const hastItens = () => {
    return itemLicitacao != null;
  }

  const goListTab = () => {
    setTabSelected(TABS_COTACAO.LIST.key)
  }



  const items = [
    {
      key: INFO_TYPE.TODOS,
      label: "Todas as Informações",
    },
    {
      key: INFO_TYPE.LICITACAO,
      label: "Dados da Licitação",
    },
    {
      key: INFO_TYPE.ITEM,
      label: "Informações Gerais do Item",
    },
  ];
  const [selectedKeys, setSelectedKeys] = useState<Iterable<string|number>>(new Set([INFO_TYPE.TODOS]));
  const selectValue = (keys:Selection):any => {
    if (keys instanceof Set) {
      const it = keys.values();
      const first = it.next();
      setSelectedKeys(new Set([first.value]));
    }
  }
  const hasSelectedValue = (vals:string[]) => {
    const arr = Array.from(selectedKeys);
    const res = vals.filter((s) => arr.indexOf(s) != -1)
    return res.length > 0;
  }

  return (
    <section className='container flex flex-col items-start justify-start'>
        <FormTitle className='text-lg font-bold uppercase text-primary flex flex-row items-center justify-between w-full'>
          <div className="flex-auto">
            {showTitle()}
          </div>
          <Button color="secondary" type="button" onClick={goListTab}>
            Voltar para Listagem
          </Button>
        </FormTitle>
        <Divider className="my-4" />
        <FormRow className='flex flex-col items-start justify-start'>
          { isLoading && 
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-4/5 rounded-lg"/>
                <Skeleton className="h-3 w-3/5 rounded-lg"/>
                <Skeleton className="h-3 w-5/5 rounded-lg"/>
                <Skeleton className="h-3 w-4/5 rounded-lg"/>
              </div>
            </div>
          }
          { !hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <p>Item de Licitação não encontrado. Tente novamente.</p>
            </div>
          }
          { hastItens() && !isLoading && 
            <div className='flex md:flex-row flex-col w-full items-start justify-start gap-4'>
              <div className='flex flex-col md:flex-row items-start justify-start basis-1/4 border-small rounded-small border-default-200 dark:border-default-100 w-full'>
                <Listbox
                  aria-label="Seleção do Tipo de Visualização"
                  variant="flat"
                  className="w-full"
                  disallowEmptySelection
                  selectionMode="single"
                  items={items}
                  selectedKeys={selectedKeys}
                  onSelectionChange={selectValue}
                >
                  <ListboxSection title="Modos de Visualização">
                    
                    {items.map((item) => (
                      <ListboxItem key={item.key}>
                        {item.label}
                      </ListboxItem>
                    ))}
                  </ListboxSection>
                </Listbox>
              </div>

              <div className='flex flex-col items-start justify-start basis-3/4'>
                { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.ITEM]) &&
                  <section className='flex-1 w-full gap-4 pb-6'>
                    <InfoTitle>Informações Gerais do Item</InfoTitle>
                    <Divider orientation="horizontal" />
                    <Spacer y={3} />
                    <FormRow>
                      <InfoText label="Unidade" orientarion="row">
                        {itemLicitacao?.unidadeFornecimento.nome}
                      </InfoText>
                      <InfoText label="Quantidade" orientarion="row">
                        {itemLicitacao?.quantidade}
                      </InfoText>
                      <InfoText label="Valor" orientarion="row">
                        {itemLicitacao?.valor}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Descrição">
                        {itemLicitacao?.descricao}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Descrição Complementar">
                        {itemLicitacao?.descricaoComplementar}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Material">
                        (CatMat: {itemLicitacao?.material.codigo}) - {itemLicitacao?.material.nome}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Fornecedor">
                        {itemLicitacao?.fornecedor.nome}
                      </InfoText>
                      <InfoText label="Porte">
                        {itemLicitacao?.fornecedor.porte.nome}
                      </InfoText>
                      <InfoText label="Documento">
                        {itemLicitacao?.fornecedor.documento}
                      </InfoText>
                    </FormRow>
                  </section>
                }
                { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.LICITACAO]) &&
                  <section className='flex-1 w-full gap-4 pb-6'>
                    <InfoTitle>Dados da Licitação</InfoTitle>
                    <Divider orientation="horizontal" />
                    <Spacer y={3} />
                    <FormRow>
                      <InfoText label="Ano Compra" orientarion="row">
                        {itemLicitacao?.licitacao.anoCompra}
                      </InfoText>
                      <InfoText label="Data Abertura" orientarion="row">
                        {itemLicitacao?.licitacao.dataAbertura}
                      </InfoText>
                      <InfoText label="Data Resultado" orientarion="row">
                        {itemLicitacao?.licitacao.dataResultadoCompra}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Processo" orientarion="row">
                        {itemLicitacao?.licitacao.numeroProcesso}
                      </InfoText>
                      <InfoText label="Situacao" orientarion="row">
                        {itemLicitacao?.licitacao.situacao.nome}
                      </InfoText>
                      <InfoText label="Valor" orientarion="row">
                        {itemLicitacao?.licitacao.valor}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Esfera" orientarion="row">
                        {itemLicitacao?.licitacao.esfera.nome}
                      </InfoText>
                      <InfoText label="Estado" orientarion="row">
                        {itemLicitacao?.licitacao.municipio.uf.nome} ({itemLicitacao?.licitacao.municipio.uf.sigla})
                      </InfoText>
                      <InfoText label="Municipio" orientarion="row">
                        {itemLicitacao?.licitacao.municipio.nome}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow py={2}>
                      <InfoText label="Objeto da Licitação">
                        {itemLicitacao?.licitacao.objeto}
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Forma Compra">
                        {itemLicitacao?.licitacao.formaCompra.nome} ({itemLicitacao?.licitacao.formaCompra.sigla})
                      </InfoText>
                      <InfoText label="Modalidade Compra">
                        {itemLicitacao?.licitacao.modalidadeCompra.nome} ({itemLicitacao?.licitacao.modalidadeCompra.codigo})
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Unidade Gestora">
                        {itemLicitacao?.licitacao.unidadeGestora.nome} ({itemLicitacao?.licitacao.unidadeGestora.codigo})
                      </InfoText>
                    </FormRow>
                    <Divider orientation="horizontal" />
                    <FormRow>
                      <InfoText label="Órgão">
                        {itemLicitacao?.licitacao.orgao.nome} ({itemLicitacao?.licitacao.orgao.codigo})
                      </InfoText>
                    </FormRow>
                    
                    { !itemLicitacao?.licitacao.orgao.ehsuperior &&
                      <div>
                        <Divider orientation="horizontal" />
                        <FormRow>
                          <InfoText label="Órgão Superior">
                            {itemLicitacao?.licitacao.orgaoSuperior.nome} ({itemLicitacao?.licitacao.orgaoSuperior.codigo})
                          </InfoText>
                        </FormRow>
                      </div>
                    }
                  </section>
                }
                
              </div>

              


            </div>
          }
        </FormRow>
      </section>
  );
}

export default ViewItemLicitacao;