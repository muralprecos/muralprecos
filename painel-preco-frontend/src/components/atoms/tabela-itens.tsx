"use client";

import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import TabelaItensLicitacaoDesktop from "./tabela-itens-desktop";
import ListagemItensLicitacaoMobile from "./listagem-itens-mobile";

interface IProps {
  itens: IRetornoPesquisaItensLicitacao[];
  onSelectItem: (uuid: string) => void;
  setIsLoading?: (v: boolean) => void;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
}

export default function TabelaItensLicitacao({
  itens,
  onSelectItem,
  setIsLoading,
  currentSort,
  onSortChange,
}: IProps) {
  if (itens.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border text-center">
        Nenhum item encontrado.
      </div>
    );
  }

  return (
    <div className="bg-card overflow-hidden animate-fade-in">
      <div className="hidden md:block">
        <TabelaItensLicitacaoDesktop
          itens={itens}
          onSelectItem={onSelectItem}
          setIsLoading={setIsLoading}
          currentSort={currentSort}
          onSortChange={onSortChange}
        />
      </div>

      <div className="md:hidden">
        <ListagemItensLicitacaoMobile
          itens={itens}
          onSelectItem={onSelectItem}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
}
