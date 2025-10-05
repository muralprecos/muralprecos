import { Card } from "../ui/card";

export default function LoadingForm() {
  return (
    <Card>
      <div
        className="w-full max-w-7xl mx-auto p-4 space-y-6 animate-pulse"
        aria-busy="true"
        aria-label="Carregando formulário de cotações"
      >
        {/* Linha 1: Período da Compra, Unidade Federativa, Município */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-10 bg-muted-foreground/20 rounded"></div>
          <div className="h-10 bg-muted-foreground/20 rounded"></div>
          <div className="h-10 bg-muted-foreground/20 rounded"></div>
        </div>

        {/* Linha 2: Descrição do Item */}
        <div className="h-10 bg-muted-foreground/20 rounded w-full"></div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <div className="h-10 w-32 bg-muted-foreground/20 rounded"></div>
          <div className="h-10 w-24 bg-muted-foreground/20 rounded"></div>
          <div className="h-10 w-24 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    </Card>
  );
}
