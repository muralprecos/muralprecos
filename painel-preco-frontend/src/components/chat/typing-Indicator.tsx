import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
        <Bot className="w-4 h-4" />
      </div>

      <div className="max-w-[70%] sm:max-w-[80%] mr-12">
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border shadow-sm">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              Assistente está digitando...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
