export default function LoadingList({ ...opts }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-4 py-6"
      aria-busy="true"
      aria-label="Carregando lista de cotações"
      {...opts}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-full max-w-12xl bg-muted border border-border rounded-xl p-4 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/5 bg-muted-foreground/20 rounded"></div>
              <div className="h-4 w-2/5 bg-muted-foreground/30 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-muted-foreground/20 rounded"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="h-3 w-1/4 bg-muted-foreground/20 rounded"></div>
            <div className="h-3 w-16 bg-muted-foreground/30 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
