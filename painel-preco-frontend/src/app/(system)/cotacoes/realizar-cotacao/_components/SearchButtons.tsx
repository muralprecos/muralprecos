import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Search } from "lucide-react";
import LoadingCircleIcon from "@/components/atoms/LoadingCircleIcon";
import { ModalConfirm } from "@/components/molecules/ModalConfirm";

interface SearchButtonsProps {
  showAdvancedForm: boolean;
  handleAdvancedFormClick: () => void;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
  clearForm: () => void;
  doingRequest: boolean;
  onConfirmClear?: () => void;
}

export function SearchButtons({
  setIsModalOpen,
  isModalOpen,
  clearForm,
  doingRequest,
  showAdvancedForm,
  handleAdvancedFormClick,
  onConfirmClear,
}: SearchButtonsProps) {
  return (
    <div className="flex flex-col items-end gap-4 md:flex-row md:justify-end">
      <Button
        type="button"
        className="w-full md:w-auto"
        variant="outline"
        onClick={handleAdvancedFormClick}
      >
        {showAdvancedForm ? "Ocultar filtros avançados" : "Filtros avançados"}
      </Button>

      <Button
        type="button"
        className="w-full md:w-auto"
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Limpar
      </Button>

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
        actionYes={onConfirmClear ?? clearForm}
      />
    </div>
  );
}
