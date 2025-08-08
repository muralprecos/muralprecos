import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Search } from "lucide-react";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import LoadingCircleIcon from "@/components/atoms/LoadingCircleIcon";

interface SearchButtonsProps {
  showAdvancedForm: boolean;
  handleAdvancedFormClick: () => void;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
  clearForm: () => void;
  doingRequest: boolean;
}

export function SearchButtons({
  showAdvancedForm,
  handleAdvancedFormClick,
  setIsModalOpen,
  isModalOpen,
  clearForm,
  doingRequest,
}: SearchButtonsProps) {
  return (
    <div className="flex flex-col items-end gap-4 md:flex-row md:justify-end">
      {/* Botão Busca Avançada */}
      <Button
        type="button"
        onClick={handleAdvancedFormClick}
        aria-pressed={showAdvancedForm}
        aria-label={
          showAdvancedForm
            ? "Alternar para busca simplificada"
            : "Alternar para busca avançada"
        }
        variant="outline"
        className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200 w-full md:w-auto"
      >
        {showAdvancedForm ? <ChevronUp /> : <ChevronDown />}
        <span>
          {showAdvancedForm ? "Busca Simplificada" : "Busca Avançada"}
        </span>
      </Button>

      {/* Botão Limpar com Modal */}
      <Button
        type="button"
        className="w-full md:w-auto"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Limpar
      </Button>

      {/* Botão Pesquisar */}
      <Button
        type="submit"
        disabled={doingRequest}
        className="flex items-center gap-2 w-full md:w-auto btn"
      >
        {!doingRequest ? (
          <>
            <Search className="h-4 w-4" />
            Pesquisar
          </>
        ) : (
          <>
            <LoadingCircleIcon />
            Pesquisando...
          </>
        )}
      </Button>

      <ModalConfirm
        title="Limpar Filtros da Nova Cotação"
        description="Você deseja limpar os filtros da Cotação?"
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        actionYes={clearForm}
      />
    </div>
  );
}
