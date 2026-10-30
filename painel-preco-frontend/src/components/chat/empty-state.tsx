import { MessageCircle, Lightbulb, FileText, HelpCircle } from "lucide-react";

export const EmptyState = () => {
  const suggestions = [
    {
      icon: FileText,
      text: "Como participar de uma licitação pública?",
    },
    {
      icon: HelpCircle,
      text: "Quais documentos são necessários para habilitação?",
    },
    {
      icon: Lightbulb,
      text: "Dicas para elaborar uma proposta competitiva",
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          Bem-vindo ao Assistente de Licitações
        </h2>

        <p className="text-muted-foreground mb-6">
          Faça suas perguntas sobre processos licitatórios e receba orientações
          especializadas
        </p>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground mb-3">
            Sugestões para começar:
          </p>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-left hover:bg-muted transition-colors cursor-pointer"
            >
              <suggestion.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{suggestion.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
