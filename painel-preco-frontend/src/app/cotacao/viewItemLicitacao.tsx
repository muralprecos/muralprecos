// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, ScrollShadow, Skeleton } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "next-themes";
import { TABS_COTACAO } from "./pageClient";

export interface IPropsViewItensLicitacao {
  isLoading: boolean
  itemLicitacao: IItemLicitacao|null
  setTabSelected: Dispatch<SetStateAction<string>>
}

const ViewItemLicitacao: React.FC<IPropsViewItensLicitacao> = ({
  isLoading = false,
  itemLicitacao,
  setTabSelected,
  ...opts
}) => {
  const { theme, setTheme } = useTheme()

  const hastItens = () => {
    return itemLicitacao != null;
  }

  const goListTab = () => {
    setTabSelected(TABS_COTACAO.LIST.key)
  }

  return (
    <section className='container flex flex-col items-start justify-start'>
        <FormTitle className='text-lg font-bold uppercase text-primary'>Resultado da Cotação</FormTitle>
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
              <Divider className="my-4" />
              <FormRow className="flex flex-row items-center justify-end">
                <div className="flex">
                  <Button color="primary" type="button" onClick={goListTab}>
                    Voltar
                  </Button>
                </div>
              </FormRow>
            </div>
          }
          { hastItens() && !isLoading && 
            <div className='flex flex-col w-full items-start justify-start'>
              <div><pre>{JSON.stringify(itemLicitacao, null, 2) }</pre></div>
              <Divider className="my-4" />
              <FormRow className="flex flex-row items-center justify-between">
                <div className="flex">
                  <Button color="primary" type="button" onClick={goListTab}>
                  Voltar
                  </Button>
                </div>
              </FormRow>
            </div>
          }
        </FormRow>
      </section>
  );
}

export default ViewItemLicitacao;