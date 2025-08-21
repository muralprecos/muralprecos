"use client";

export default function LoadingItem({ ...opts }) {
  return (
    <div
      className="w-full max-w-7xl mx-auto p-4 space-y-6 animate-pulse"
      aria-busy="true"
      aria-label="Carregando detalhes do item"
    >
      {/* Cabeçalho com título e botões */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-muted-foreground/20 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-muted-foreground/20 rounded"></div>
          <div className="h-8 w-24 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>

      {/* Container principal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lado esquerdo: Modos de visualização */}
        <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
          <div className="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
          <div className="h-10 w-full bg-muted-foreground/20 rounded"></div>
          <div className="h-8 w-full bg-muted-foreground/20 rounded"></div>
        </div>

        {/* Lado direito: Informações gerais */}
        <div className="sm:col-span-2 bg-muted/30 border border-border rounded-lg p-4 space-y-6">
          {/* Título */}
          <div className="h-12 w-full bg-muted-foreground/20 rounded"></div>

          {/* Linhas de informação */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-2/5 bg-muted-foreground/20 rounded"></div>
              <div className="h-3 w-2/5 bg-muted-foreground/30 rounded"></div>
            </div>
          ))}

          <div className="h-3 w-2/5 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 w-2/5 bg-muted-foreground/20 rounded"></div>

          <div className="flex justify-between">
            <div className="h-3 w-1/5 bg-muted-foreground/20 rounded"></div>
            <div className="h-3 w-1/5 bg-muted-foreground/30 rounded"></div>
            <div className="h-3 w-1/5 bg-muted-foreground/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
