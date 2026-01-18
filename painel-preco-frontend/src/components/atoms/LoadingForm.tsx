import { Card } from "../ui/card";

export default function LoadingForm() {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <div
        className="p-6 space-y-6 animate-pulse"
        aria-busy="true"
        aria-label="Carregando formulário de cotações"
      >
        {/* Título + descrição */}
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted-foreground/15 rounded"></div>
          <div className="h-4 w-64 bg-muted-foreground/15 rounded"></div>
        </div>

        {/* Textarea */}
        <div className="h-28 w-full bg-muted-foreground/15 rounded-lg"></div>

        {/* Linha de selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
        </div>

        {/* Segunda linha de selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
          <div className="h-10 bg-muted-foreground/15 rounded"></div>
        </div>

        {/* Botões */}
        <div className="flex justify-end items-center gap-4 pt-2">
          <div className="h-10 w-32 bg-muted-foreground/15 rounded"></div>
          <div className="h-10 w-28 bg-muted-foreground/15 rounded"></div>
        </div>
      </div>
    </Card>
  );
}
