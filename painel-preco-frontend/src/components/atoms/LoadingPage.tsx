"use client";

export default function LoadingPage({ ...opts }) {
  return (
    <div
      className="w-full flex items-center justify-center py-8"
      aria-busy="true"
      aria-label="Carregando formulário"
      {...opts}
    >
      <div className="w-full max-w-md bg-muted border border-border rounded-xl p-6 shadow-sm animate-pulse space-y-6">
        <div className="h-5 w-2/3 bg-muted-foreground/30 rounded"></div>

        <div className="space-y-4">
          <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
          <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
          <div className="h-24 w-full bg-muted-foreground/10 rounded"></div>
        </div>

        <div className="flex justify-end gap-3">
          <div className="h-8 w-24 bg-muted-foreground/20 rounded"></div>
          <div className="h-8 w-20 bg-muted-foreground/30 rounded"></div>
        </div>
      </div>
    </div>
  );
}
